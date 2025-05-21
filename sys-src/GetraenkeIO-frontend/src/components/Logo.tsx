import { FireFilled } from '@ant-design/icons';

const Logo = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '10px',
        gap: '10px',
        background: '#115293',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#19276d2',
        }}
      >
        <img
          alt='Logo'
          src='/beer.png'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <span
        style={{
          fontSize: '1.4rem',
          fontFamily: '"JetBrains Mono", bold',
          color: '#fff',
        }}
      >
        GetränkeIO
      </span>
    </div>
  );
};

export default Logo;
