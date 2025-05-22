import CustomSidebar from '../components/HomeSidebar';

const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <CustomSidebar />
      <main style={{ flex: '1', padding: '1rem' }}>
        <h1>Willkommen bei GetränkeIO</h1>
      </main>
    </div>
  );
};

export default Home;
