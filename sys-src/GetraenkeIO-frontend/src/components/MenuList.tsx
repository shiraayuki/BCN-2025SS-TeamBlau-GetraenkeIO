import { styled } from '@mui/material';
import { Menu } from 'antd';
import { PiBeerBottleFill, PiHourglassMedium } from 'react-icons/pi';
import { FaRegHourglass } from 'react-icons/fa';

const CustomMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: white !important;
    color: #115293 !important;
  }
  .ant-menu-item {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const MenuList = () => {
  return (
    <CustomMenu
      style={{
        background: '#115293',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        fontSize: '1rem',
        position: 'relative',
        fontFamily: '"JetBrains Mono", bold',
      }}
    >
      <Menu.Item key='getraenke' icon={<PiBeerBottleFill size={24} />} style={{ color: '#fff' }}>
        Getränke
      </Menu.Item>
      <Menu.Item key='histroy' icon={<FaRegHourglass size={24} />} style={{ color: '#fff' }}>
        Bestellverlauf
      </Menu.Item>
    </CustomMenu>
  );
};

export default MenuList;
