
-- Create enum types for better data consistency
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.subscription_plan AS ENUM ('silver', 'gold', 'platinum');
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('stripe', 'paypal', 'mpesa');
CREATE TYPE public.tip_type AS ENUM ('single', 'parlay');

-- Create profiles table to store user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL DEFAULT 'pending',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tips table
CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_name TEXT NOT NULL,
  odds DECIMAL(5,2) NOT NULL,
  tip TEXT NOT NULL,
  plan_access subscription_plan NOT NULL,
  tip_type tip_type NOT NULL DEFAULT 'single',
  parlay_group UUID,
  analysis TEXT,
  match_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  plan subscription_plan NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  method payment_method NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create security definer function to check active subscription
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(user_id UUID)
RETURNS subscription_plan
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT plan FROM public.subscriptions 
  WHERE user_id = $1 
    AND status = 'active' 
    AND start_date <= now() 
    AND end_date > now()
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Create security definer function to check if user can access tip
CREATE OR REPLACE FUNCTION public.can_access_tip(user_id UUID, tip_plan subscription_plan)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN public.get_user_role(user_id) = 'admin' THEN true
    WHEN public.get_user_active_subscription(user_id) IS NULL THEN false
    WHEN tip_plan = 'silver' THEN true
    WHEN tip_plan = 'gold' AND public.get_user_active_subscription(user_id) IN ('gold', 'platinum') THEN true
    WHEN tip_plan = 'platinum' AND public.get_user_active_subscription(user_id) = 'platinum' THEN true
    ELSE false
  END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update subscriptions" ON public.subscriptions
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for tips
CREATE POLICY "Users can view accessible tips" ON public.tips
  FOR SELECT USING (public.can_access_tip(auth.uid(), plan_access));

CREATE POLICY "Admins can manage tips" ON public.tips
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Allow payment creation" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user')::user_role,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status_dates ON public.subscriptions(status, start_date, end_date);
CREATE INDEX idx_tips_plan_access ON public.tips(plan_access);
CREATE INDEX idx_tips_created_at ON public.tips(created_at DESC);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
