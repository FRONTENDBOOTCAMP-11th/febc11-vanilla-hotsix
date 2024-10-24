import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// response로 받은 img url을 매개변수로 입력
const getImg = async img => {
  try {
    const res = await axios.get(`${apiUrl}/${img}`, {
      responseType: 'arraybuffer', // 바이너리 데이터로 받기 위한 설정
      headers: {
        'client-id': clientId,
        'Content-Type': 'application/json',
      }
    });

    const contentType = res.headers['content-type'] || 'image/webp';

    // Blob 생성
    const blob = new Blob([res.data], { type: contentType });

    // Blob을 URL로 변환
    const imageUrl = URL.createObjectURL(blob);

    // 이미지 URL 반환
    return imageUrl;
  } catch (err) {
    console.error(err);
  }
};

export default getImg;
