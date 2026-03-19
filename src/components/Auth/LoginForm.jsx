import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router';
import { Bounce, toast } from 'react-toastify';
import { loginSchema } from '../lib/loginSchema';
import { logInUser } from '../services/authServices';
import { authContext } from '../context/AuthContext';
import ThemeToggle from "../lib/ThemeToggle";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

export default function LoginForm() {
  const { setToken } = useContext(authContext)
  const [showPassword, setshowPassword] = useState(false)
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, reset } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    }
  })
  async function onSubmit(formData) {
    try {
      const data = await logInUser(formData);
      console.log("Full response:", data);
      if (data.token) {
        localStorage.setItem("userToken", data.token);
        setToken(data.token);

        toast.success(t("successLogin"), {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });

        reset();
        navigate('/', { replace: true });
      }
    } catch (error) {
      const msg = error.response?.data?.message
        || error.response?.data?.error
        || "Invalid email or password";

      toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
  }
  return (
    <>
      <main className='bg-theme-page h-screen flex justify-center items-center py-2'>
        <div className="regForm py-12 px-4 w-[95%] md:w-[80%] lg:w-[75%] auth-card mx-auto text-center border rounded-xl shadow">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <form className='my-2 space-y-3 px-2' onSubmit={handleSubmit(onSubmit)}>
            <header>
              <h1 className='text-xl font-bold text-theme-primary'>{t("login.title")}</h1>
              <p className='font-semibold text-medium text-theme-muted'>{t("login.noAccount")}{" "}<Link className='text-brand-500 underline' to={'/signup'}>{t("login.createAccount")}</Link></p>
            </header>
            <div className="socialBtns flex gap-3 items-center *:grow justify-center">
              <Button className='bg-transparent border border-theme font-bold text-theme-primary' startContent={<FaGoogle className='text-[#ea4335]' />}>{t("login.social.google")}</Button>
              <Button className='bg-[#1877f2] border border-gray-300 text-white font-bold' startContent={<FaFacebookF className='text-white' />}>{t("login.social.facebook")}</Button>
            </div>
            <div className="seperator relative">
              <p className='text-theme-secondary before:absolute before:h-[1.5px] before:rounded-2xl before:w-12 before:bg-gray-400/50 before:top-3 before:left-5 after:absolute after:h-[1.5px] after:w-12 after:bg-gray-400/50 after:top-3 after:right-5 after:rounded-2xl'>{t("login.social.separator")}</p>
            </div>
            <div className="form-control flex flex-col space-y-4">
              <Input
                {...register("email")}
                startContent={<FaEnvelope className='text-gray-500' />}
                className='text-start'
                label={t("login.form.email.label")}
                labelPlacement="outside"
                placeholder={t("login.form.email.placeholder")}
                type="email"
                isInvalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
              />
              <Input
                {...register("password")}
                startContent={<FaLock className='text-gray-500' />}
                className='text-start'
                label={t("login.form.password.label")}
                labelPlacement="outside"
                placeholder={t("login.form.password.placeholder")}
                type={showPassword ? "text" : "password"}
                isInvalid={Boolean(errors.password)}
                errorMessage={errors.password?.message}
                endContent={showPassword ?
                  <FaEyeSlash className='text-gray-500 cursor-pointer' onClick={() => { setshowPassword(false) }} />
                  : <FaEye className='text-gray-500 cursor-pointer' onClick={() => { setshowPassword(true) }} />
                }
              />
            </div>
            <Button isDisabled={!isValid} isLoading={isSubmitting} type='submit' endContent={<FaArrowRight />} color="primary" className='text-md w-full font-semibold mt-2 text-white'>{t("login.submit")}</Button>
          </form>
        </div>
      </main>
    </>
  )
}
