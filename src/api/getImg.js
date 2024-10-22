import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;

// response로 받은 img url을 매개변수로 입력
const getImg = async img => {
  try {
    const res = await axios.get(apiUrl + `${img}`, {
      responseType: 'arraybuffer', // 바이너리 데이터로 받기 위한 설정
    });

    // Blob 생성
    const blob = new Blob([res.data], { type: 'image/webp' });

    // Blob을 URL로 변환
    const imageUrl = URL.createObjectURL(blob);

    // 이미지 URL 반환
    return imageUrl;
  } catch (err) {
    console.error(err);
  }
};

export default getImg;
