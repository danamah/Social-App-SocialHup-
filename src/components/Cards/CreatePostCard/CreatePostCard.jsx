// src/components/Cards/CreatePostCard/CreatePost.jsx
import { Avatar, Button, useDisclosure } from '@heroui/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSmile } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { MdInsertPhoto } from "react-icons/md";

import { UserLoggedInfoContext } from '../../context/UserLoggedContext';
import CreatePostModal from './CreatePostCardModal';

export default function CreatePost() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userData } = useContext(UserLoggedInfoContext);
  const { t } = useTranslation();

  return (
    <>
      <main className='rounded-xl border border-theme p-3 bg-theme-card my-2.5 transition-colors duration-300'>
        {/* Input row */}
        <header className='flex items-center gap-2 my-2'>
          <Avatar src={userData?.photo} />
          <input
            onClick={onOpen}
            readOnly
            type="text"
            placeholder={`${t("post.what_on_mind")} ${userData?.name ?? ""}...`}
            className='bg-theme-secondary text-theme-primary placeholder:text-theme-muted w-full focus:outline-none py-2 px-3 rounded-xl cursor-pointer transition-colors duration-300 border border-transparent hover:border-brand-300'
          />
        </header>

        {/* Actions row */}
        <div className="flex items-center justify-between px-1">
          <div className='flex items-center gap-4'>
            <button onClick={onOpen} className='flex items-center gap-1.5 group cursor-pointer'>
              <MdInsertPhoto className='text-theme-secondary text-xl group-hover:text-green-500 transition-colors duration-250' />
              <span className='text-theme-secondary text-sm group-hover:text-green-500 transition-colors duration-250'>
                {t("post.photo", "Photo")}
              </span>
            </button>
            <button className='flex items-center gap-1.5 group cursor-pointer'>
              <FaVideo className='text-theme-secondary text-xl group-hover:text-orange-500 transition-colors duration-250' />
              <span className='text-theme-secondary text-sm group-hover:text-orange-500 transition-colors duration-250'>
                {t("post.video", "Video")}
              </span>
            </button>
            <button className='flex items-center gap-1.5 group cursor-pointer'>
              <FaSmile className='text-theme-secondary text-xl group-hover:text-yellow-500 transition-colors duration-250' />
              <span className='text-theme-secondary text-sm group-hover:text-yellow-500 transition-colors duration-250'>
                {t("post.emoji", "Emoji")}
              </span>
            </button>
          </div>

          <Button
            onPress={onOpen}
            color='secondary'
            className='text-white font-medium'
            radius='full'
            size='sm'
          >
            {t("post.publish")}
          </Button>
        </div>
      </main>

      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}