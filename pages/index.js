// import { useState } from 'react';

// export default function Home() {
//   const [counts, setCounts] = useState({
//     'channel-1': null,
//     'channel-2': null,
//     'channel-3': null,
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function fetchCount(channel) {
//     try {
//       const res = await fetch(`/api/feeds?feed=${channel}`);
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || 'Unknown error');
//       }
//       const data = await res.json();
//       return data.value; // значение последнего datapoint
//     } catch (e) {
//       setError(e.message);
//       return null;
//     }
//   }

//   async function loadData() {
//     setLoading(true);
//     setError(null);
//     const ch1 = await fetchCount('channel-1');
//     const ch2 = await fetchCount('channel-2');
//     const ch3 = await fetchCount('channel-3');
//     setCounts({
//       'channel-1': ch1,
//       'channel-2': ch2,
//       'channel-3': ch3,
//     });
//     setLoading(false);
//   }

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
//       <h1>Счётчики циклов с ESP32</h1>
//       {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
//       <ul>
//         <li>Channel 1: {counts['channel-1'] ?? 'Не загружено'}</li>
//         <li>Channel 2: {counts['channel-2'] ?? 'Не загружено'}</li>
//         <li>Channel 3: {counts['channel-3'] ?? 'Не загружено'}</li>
//       </ul>
//       <button onClick={loadData} disabled={loading}>
//         {loading ? 'Загрузка...' : 'Обновить'}
//       </button>
//       <p>Нажмите "Обновить" для загрузки актуальных данных из Adafruit IO.</p>
//     </div>
//   );
// }








import { useState } from 'react';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    background: '#121212',
    color: '#eee',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    minHeight: '100vh',
    margin: 0,
  },
  title: {
    marginBottom: '0.5em',
    color: '#4caf50',
  },
  channel: {
    background: '#222',
    borderRadius: 8,
    padding: '15px 25px',
    margin: '10px 0',
    width: 300,
    boxShadow: '0 0 10px #4caf50aa',
    textAlign: 'center',
  },
  channelTitle: {
    margin: '0 0 10px 0',
    fontWeight: 'normal',
    color: '#90ee90',
  },
  count: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#4caf50',
    userSelect: 'none',
  },
  status: {
    marginTop: 20,
    fontSize: '1em',
    color: '#ffcc00',
    userSelect: 'none',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    padding: '10px 25px',
    fontSize: '1.1em',
    border: 'none',
    borderRadius: 6,
    backgroundColor: '#4caf50',
    color: '#121212',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    userSelect: 'none',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  buttonActive: {
    backgroundColor: '#3e8e41',
  },
  footer: {
    marginTop: 'auto',
    fontSize: '0.8em',
    color: '#666',
    textAlign: 'center',
  },
  link: {
    color: '#4caf50',
    textDecoration: 'none',
  },
};

export default function Home() {
  const [counts, setCounts] = useState({
    'channel-1': null,
    'channel-2': null,
    'channel-3': null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('Нажмите кнопку "Обновить" для загрузки данных');

  async function fetchCount(channel) {
    try {
      const res = await fetch(`/api/feeds?feed=${channel}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Неизвестная ошибка');
      }
      const data = await res.json();
      return data.value;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    setStatusText('Загрузка данных...');
    const ch1 = await fetchCount('channel-1');
    const ch2 = await fetchCount('channel-2');
    const ch3 = await fetchCount('channel-3');

    setCounts({
      'channel-1': ch1,
      'channel-2': ch2,
      'channel-3': ch3,
    });

    if (!ch1 && !ch2 && !ch3) {
      setStatusText('Ошибка загрузки данных');
    } else {
      setStatusText('Данные обновлены: ' + new Date().toLocaleTimeString());
    }
    setLoading(false);
  }

  return (
    <div style={styles.body}>
      <h1 style={styles.title}>Счетчики импульсов (3 канала)</h1>

      {error && <p style={styles.error}>Ошибка: {error}</p>}

      <div style={styles.channel} id="channel1">
        <h2 style={styles.channelTitle}>Канал 1</h2>
        <div style={styles.count}>{counts['channel-1'] ?? '–'}</div>
      </div>

      <div style={styles.channel} id="channel2">
        <h2 style={styles.channelTitle}>Канал 2</h2>
        <div style={styles.count}>{counts['channel-2'] ?? '–'}</div>
      </div>

      <div style={styles.channel} id="channel3">
        <h2 style={styles.channelTitle}>Канал 3</h2>
        <div style={styles.count}>{counts['channel-3'] ?? '–'}</div>
      </div>

      <button style={styles.button} onClick={loadData} disabled={loading}>
        {loading ? 'Загрузка...' : 'Обновить'}
      </button>

      <div style={styles.status} id="status">{statusText}</div>

      <div style={styles.footer}>
        Данные получены с ESP32 через{' '}
        <a
          href="https://io.adafruit.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Adafruit IO
        </a>
        <br />
        Автор: Ваше имя
      </div>
    </div>
  );
}
