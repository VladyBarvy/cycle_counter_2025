import { useState } from 'react';

export default function Home() {
  const [counts, setCounts] = useState({
    'channel-1': null,
    'channel-2': null,
    'channel-3': null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchCount(channel) {
    try {
      const res = await fetch(`/api/feeds?feed=${channel}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Unknown error');
      }
      const data = await res.json();
      return data.value; // значение последнего datapoint
    } catch (e) {
      setError(e.message);
      return null;
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    const ch1 = await fetchCount('channel-1');
    const ch2 = await fetchCount('channel-2');
    const ch3 = await fetchCount('channel-3');
    setCounts({
      'channel-1': ch1,
      'channel-2': ch2,
      'channel-3': ch3,
    });
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Счётчики циклов с ESP32</h1>
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      <ul>
        <li>Channel 1: {counts['channel-1'] ?? 'Не загружено'}</li>
        <li>Channel 2: {counts['channel-2'] ?? 'Не загружено'}</li>
        <li>Channel 3: {counts['channel-3'] ?? 'Не загружено'}</li>
      </ul>
      <button onClick={loadData} disabled={loading}>
        {loading ? 'Загрузка...' : 'Обновить'}
      </button>
      <p>Нажмите "Обновить" для загрузки актуальных данных из Adafruit IO.</p>
    </div>
  );
}
