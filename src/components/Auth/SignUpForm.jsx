import { Button, Checkbox, DatePicker, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaEnvelope, FaFacebookF, FaGoogle, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router';
import { registerSchema } from '../lib/authSchema';
import { Controller } from 'react-hook-form';
import { FaCalendar } from "react-icons/fa";
import { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { registerUser } from '../services/authServices';
import { toast, Bounce } from 'react-toastify';
import ThemeToggle from "../lib/ThemeToggle";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

export default function RegisterForm() {
  const [showPassword, setshowPassword] = useState(false)
  const [showRePassword, setshowRePassword] = useState(false)
  const { t } = useTranslation();
  const navigate = useNavigate()
  const gender = [
    { key: "male", label: t("register.form.gender.male") },
    { key: "female", label: t("register.form.gender.female") }
  ];
  const { register, control, handleSubmit, formState: { errors, isSubmitting, isValid }, reset } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    }
  })
  async function onSubmit(formData) {
    try {
      const data = await registerUser(formData);
      console.log("Full response:", data);
      console.log("Token:", data?.token);
      console.log("Keys:", Object.keys(data || {}));
      if (data?.token) {
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
        reset();
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.message
        || error.response?.data?.error
        || "Something went wrong";

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
      <main className='bg-theme-page min-h-screen flex justify-center items-center py-2'>
        <div className="regForm py-2 px-4 w-[95%] md:w-[80%] lg:w-[80%] auth-card mx-auto text-center border rounded-xl shadow">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <form className='my-2 space-y-3 px-2' onSubmit={handleSubmit(onSubmit)}>
            <header>
              <h1 className='text-xl font-bold text-theme-primary'>{t("register.title")}</h1>
              <p className='font-semibold text-medium text-theme-muted'>{t("register.alreadyHaveAccount")}{" "}<Link className='text-brand-500 underline' to={'/login'}>{t("register.signIn")}</Link></p>
            </header>
            <div className="socialBtns flex gap-3 items-center *:grow justify-center">
              <Button className='bg-transparent border border-theme font-bold text-theme-primary' startContent={<FaGoogle className='text-[#ea4335]' />}>{t("register.social.google")}</Button>
              <Button className='bg-[#1877f2] border border-gray-300 text-white font-bold' startContent={<FaFacebookF className='text-white' />}>{t("register.social.facebook")}</Button>
            </div>
            <div className="seperator relative">
              <p className='text-theme-secondary before:absolute before:h-[1.5px] before:rounded-2xl before:w-12 before:bg-gray-400/50 before:top-4 before:left-10 after:absolute after:h-[1.5px] after:w-12 after:bg-gray-400/50 after:top-4 after:right-10 after:rounded-2xl'>{t("register.social.separator")}</p>
            </div>
            <div className="form-control flex flex-col space-y-4">
              <Input
                className='text-left'
                {...register("name")}
                startContent={<FaUser className='text-gray-500' />}
                label={t("register.form.name.label")}
                labelPlacement="outside"
                placeholder={t("register.form.name.placeholder")}
                type="text"
                isInvalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
              />
              <Input
                {...register("email")}
                startContent={<FaEnvelope className='text-gray-500' />}
                className='text-start'
                label={t("register.form.email.label")}
                labelPlacement="outside"
                placeholder={t("register.form.email.placeholder")}
                type="email"
                isInvalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
              />
              <Input
                {...register("password")}
                startContent={<FaLock className='text-gray-500' />}
                className='text-start'
                label={t("register.form.password.label")}
                labelPlacement="outside"
                placeholder={t("register.form.password.placeholder")}
                type={showPassword ? "text" : "password"}
                isInvalid={Boolean(errors.password)}
                errorMessage={errors.password?.message}
                endContent={showPassword ?
                  <FaEyeSlash className='text-gray-500 cursor-pointer' onClick={() => { setshowPassword(false) }} />
                  : <FaEye className='text-gray-500 cursor-pointer' onClick={() => { setshowPassword(true) }} />
                }
              />
              <Input
                {...register("rePassword")}
                className='text-start'
                startContent={<FaLock className='text-gray-500' />}
                label={t("register.form.rePassword.label")}
                labelPlacement="outside"
                placeholder={t("register.form.rePassword.placeholder")}
                type={showRePassword ? "text" : "password"}
                isInvalid={Boolean(errors.rePassword)}
                errorMessage={errors.rePassword?.message}
                endContent={showRePassword ?
                  <FaEyeSlash className='text-gray-500 cursor-pointer' onClick={() => { setshowRePassword(false) }} />
                  : <FaEye className='text-gray-500 cursor-pointer' onClick={() => { setshowRePassword(true) }} />
                }
              />
              <div className='flex gap-2 items-center'>
                <Input
                  {...register("dateOfBirth")}
                  className='text-start'
                  startContent={<FaCalendar className='text-gray-500' />}
                  label={t("register.form.dateOfBirth.label")}
                  labelPlacement="outside"
                  placeholder={t("register.form.dateOfBirth.placeholder")}
                  type="date"
                  isInvalid={Boolean(errors.dateOfBirth)}
                  errorMessage={errors.dateOfBirth?.message}
                />
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        field.onChange(Array.from(keys)[0]);
                      }}
                      className="max-w-xs text-start"
                      label={t("register.form.gender.label")}
                      labelPlacement="outside"
                      placeholder={t("register.form.gender.placeholder")}
                      isInvalid={Boolean(errors.gender)}
                      errorMessage={errors.gender?.message}
                    >
                      {gender.map((gender) => (<SelectItem key={gender.key}>{gender.label}</SelectItem>))}
                    </Select>
                  )}
                />
              </div>
            </div>
            <Checkbox>
              {t("register.terms.text")}{" "}
              <Link>{t("register.terms.terms")}</Link> {t("and")}{" "}
              <Link>{t("register.terms.privacy")}</Link>
            </Checkbox>
            <Button isDisabled={!isValid} isLoading={isSubmitting} type='submit' endContent={<FaArrowRight />} color="primary" className='text-md w-full font-semibold mt-2 text-white'>{t("register.submit")}</Button>
          </form>
        </div>
      </main>
    </>
  )
}
