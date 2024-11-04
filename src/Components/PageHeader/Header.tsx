import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { FiBell } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
    return (
        <div className="w-[100%] flex justify-between items-center p-4 bg-gray-900 rounded-lg shadow-md mb-6">
            <h1 className="text-white text-2xl font-semibold">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-700 rounded p-2">
                    <BiSearch className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none text-white" />
                </div>
                <FiBell className="text-white text-xl" />
                <FaUserCircle className="text-white text-2xl" />
            </div>
        </div>
    );
};

export default Header;
