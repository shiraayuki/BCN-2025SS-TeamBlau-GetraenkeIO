import { Layout } from 'antd';
import Logo from '../components/Logo';
import MenuList from '../components/MenuList';

const { Header, Sider } = Layout;

const Home = () => {
  return (
    <Layout>
      <Sider
        width={240}
        style={{
          color: '#fff',
        }}
      >
        <Logo />
        <MenuList />
      </Sider>
    </Layout>
  );
};

export default Home;
