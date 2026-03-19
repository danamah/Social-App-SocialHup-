import logo from '../../assets/images/network-hub.png'
import { FaMessage } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import { Avatar } from '@heroui/react';
import AuthPageBg from '../../assets/images/abstract-arrangement-networking-concept-still-life.jpg'
import { useTranslation } from 'react-i18next';
export default function AuthHero() {
    const { t } = useTranslation();
    const features = [
        {
            id: "one",
            icon: <FaMessage className='text-green-500 bg-green-300/65 rounded-lg text-3xl p-1.5' />,
            head: t("authHero.features.chat.title"),
            para: t("authHero.features.chat.desc")
        },
        {
            id: "two",
            icon: <FaBell className='text-blue-500 bg-blue-300/65 rounded-lg text-3xl p-1.5' />,
            head: t("authHero.features.alert.title"),
            para: t("authHero.features.alert.desc")
        },
        {
            id: "three",
            icon: <FaImage className='text-purple-500 bg-purple-300/65 rounded-lg text-3xl p-1.5' />,
            head: t("authHero.features.media.title"),
            para: t("authHero.features.media.desc")
        },
        {
            id: "four",
            icon: <FaUsers className='text-pink-500 bg-pink-300/65 rounded-lg text-3xl p-1.5' />,
            head: t("authHero.features.community.title"),
            para: t("authHero.features.community.desc")
        },
    ];

    const statis = [
        {
            id: "five",
            icon: <FaUsers className='text-indigo-300 text-xl' />,
            num: `2M`,
            para: t("authHero.stats.users")
        },
        {
            id: "six",
            icon: <FaHeart className='text-pink-500 text-xl' />,
            num: `10M`,
            para: t("authHero.stats.posts")
        },
        {
            id: "seven",
            icon: <FaMessage className='text-sky-500 text-xl' />,
            num: `50M`,
            para: t("authHero.stats.messages")
        },
    ];

    const nums = [
        {
            id: "eight",
            icon: <FaDownload className='text-amber-400 text-lg' />,
            para: t("authHero.numbers.downloads")
        },
        {
            id: "nine",
            icon: <FaStar className='text-amber-400 text-lg' />,
            para: t("authHero.numbers.rating")
        },
        {
            id: "ten",
            icon: <FaAward className='text-amber-400 text-lg' />,
            para: t("authHero.numbers.award")
        },
    ];

    return (
        <>
            <main className='px-4 py-4 flex flex-col space-y-3 text-neutral-50 min-h-[100%] bg-center bg-cover'
                style={{ backgroundImage: `linear-gradient(rgba(113, 50, 202,0.75),rgba(196, 123, 228,0.75)),url(${AuthPageBg})` }}>

                <header className='flex items-center'>
                    <img className='w-10 bg-neutral-50/80 border border-white/50 rounded-xl p-1 me-2' src={logo} alt="logo" />
                    <h1 className='text-xl font-bold'>{t("authHero.appName")}</h1>
                </header>

                <div className="content">
                    <div className="title">
                        <h2 className='text-4xl font-bold'>{t("authHero.title.line1")}</h2>
                        <h2 className='text-4xl pb-1.5 font-bold bg-linear-to-r from-fuchsia-300 to-fuchsia-100 bg-clip-text text-transparent'>
                            {t("authHero.title.line2")}
                        </h2>

                        <p className='text-md font-semibold text-gray-300 my-2 w-[75%]'>
                            {t("authHero.description")}
                        </p>
                    </div>
                    <section className='features-Cards my-2'>
                        {/* h3 will be read by screen reader (sr) only */}
                        <h3 className='sr-only'>Platform Features</h3>
                        <div>
                            <ul className='grid gap-2 lg:grid-cols-2'>
                                {features.map((feature) => (
                                    <li key={feature.id} className='bg-white/20 backdrop-blur-xs rounded-xl p-2 flex items-center gap-3 lg:hover:scale-105 transition-transform duration-250 border border-white/20'>
                                        <div className="icon">{feature.icon}</div>
                                        <div className="text">
                                            <h3>{feature.head}</h3>
                                            <p>{feature.para}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                    <section className='my-1 mt-4'>
                        <h3 className='sr-only'>Plateform Statistics</h3>
                        <ul className='flex items-center gap-5 my-2'>
                            {statis.map((stat) => (
                                <li key={stat.id}>
                                    <div className='flex items-center gap-1'>
                                        <div className="icon">{stat.icon}</div>
                                        <h3 className='font-black flex items-center text-xl'>{stat.num}<FaPlus className='text-[12px] font-black' /></h3>
                                    </div>
                                    <p className='text-md font-semibold'>{stat.para}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className='mt-3 mb-2'>
                        <ul className='flex items-center gap-5'>
                            {nums.map((num) => (
                                <li key={num.id} className='flex gap-1.5 bg-white/20 backdrop-blur-xs rounded-2xl px-2 py-1'>
                                    <div className="icon">{num.icon}</div>
                                    <p className='text-sm'>{num.para}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <figure className='my-2 mt-4 bg-white/20 backdrop-blur-xs rounded-xl p-2 border border-white/20 hover:bg-white/30 transition-all duration-250'>
                    <div className="rating-average flex items-center my-1 gap-1.5">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className='text-amber-400 hover:scale-110 transition-transform duration-250' />
                        ))}
                    </div>
                    <blockquote className='text-md italic'>
                        <p>{t("authHero.testimonial.text")}</p>
                    </blockquote>
                    <figcaption className='flex items-center gap-2'>
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                        <div className="info">
                            <cite>{t("authHero.testimonial.name")}</cite>
                            <p className='text-sm text-gray-200'>{t("authHero.testimonial.job")}</p>
                        </div>
                    </figcaption>
                </figure>
            </main>
        </>
    )
}
