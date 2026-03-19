import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { FaAngleDown, FaClock, FaFireAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi";
import { Link } from 'react-router';

export default function CardBar() {
  return (
    <>
      <main className='rounded-xl border border-gray-300/70 p-2 bg-white hidden lg:block'>
        <div className='flex justify-between items-center gap-2 p-2'>
          <div className='flex items-center gap-2'>
            <Button color='secondary' className='text-neutral-50 font-medium' startContent={<FaFireAlt className='text-orange-500' />}>Popular</Button>
            <Button startContent={<FaClock />} className='bg-gray-300'>Latest</Button>
            <Button startContent={<HiUsers />}>Following</Button>
          </div>
          <div className='flex items-center gap-3'>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button endContent={<FaAngleDown />}>All Topics</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" color="danger">
                  <p className="font-semibold">Technology</p>
                </DropdownItem>
                <DropdownItem key="Design">
                  Design
                </DropdownItem>
                <DropdownItem key="Bussiness" color="danger">
                  Business
                </DropdownItem>
                <DropdownItem key="Photography" color="danger">
                  Photography
                </DropdownItem>
                <DropdownItem key="Lifestyle" color="danger">
                  Lifestyle
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Link to={'#'}><TfiMenuAlt className='text-2xl' /></Link>
          </div>
        </div>
      </main>
    </>
  )
}
