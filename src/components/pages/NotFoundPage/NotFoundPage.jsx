import { Button } from "@heroui/react";
import { BsEmojiDizzyFill } from "react-icons/bs";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <>
      <main className='bg-linear-to-r from-[#8A5CF6] to-[#4F46E5] min-h-screen flex justify-center items-center'>
        <div className="error-card px-6 py-6 w-1/2 mx-auto text-center rounded-2xl shadow-2xl bg-linear-to-r from-[#8867F2] to-[#6F5EEB] border border-white/20">
          <div className="numIcon relative">
            <h1 className='text-7xl font-black bg-linear-to-t from-cyan-500 to-cyan-100 bg-clip-text text-transparent'>404</h1>
            <BsEmojiDizzyFill className="bg-linear-to-r mx-auto from-amber-500 to-amber-300 text-3xl bg-clip-text text-amber-300 absolute -top-2 right-60 animate-bounce" />
            <p className="text-white font-black text-4xl">{t("notFound.title")}<br/> <span>{t("notFound.found")}</span></p>
            <p className="text-gray-300 text-lg my-4 font-semibold">{t("notFound.para")}</p>
            <Button className=" bg-slate-800 rounded-2xl py-2 text-md font-bold px-8 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
              <Link className="text-white" to={`/`}>{t("notFound.redirect")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}