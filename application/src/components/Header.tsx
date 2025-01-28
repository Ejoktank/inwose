import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Coins } from './Coins';
import { Button } from './Button';
import { Modal } from './Modal';
import { CreateTask } from '../partials/CreateTask';
import { Logo } from '../assets/Logo';
import { CoinsProps } from '../types/types';
import { useGetTasks } from '../hooks/useGetTasks';

const headerItems = [
  { path: '/mytasks', text: 'Мои задачи' },
  { path: '/pari', text: 'Пари' },
  { path: '/team', text: 'Команда' },
]

const coins: CoinsProps = {
  coinsAmount: 0,
  hasBg: true,
  hasPlus: false,
  coinColor: 'green',
  coinsNotEarnedAmount: 0,
}

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {tasks, completed, upcoming} = useGetTasks();

  completed.forEach(task => {
    console.log("Coins amount:");
    console.log(task.coinsAmount);
    coins.coinsAmount += task.coinsAmount;
  })

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <header className="container mx-[auto] px-5">
      <div className="container-grid">
        <div className="flex items-center justify-start">
         <Logo />
        </div>
        <nav className='flex items-center justify-start gap-2'>
          {headerItems.map(item => (
            <NavLink className={(navData) => ((navData.isActive ? 'header__item header__item--active' : 'header__item'))} to={item.path} key={`header-${item.path}`}>{item.text}</NavLink>
          ))}
        </nav>
        <div className="gap-2">
          <Button type='arbitrary' style={{ backgroundColor: "#0066ff", color: "white" }} onClick={openModal}>+ создать задачу</Button>
          <Coins {...coins} />
        </div>
      </div>


      <Modal isOpen={isModalOpen} handleClose={closeModal}>
        <CreateTask />
      </Modal>
    </header>
  );
}
