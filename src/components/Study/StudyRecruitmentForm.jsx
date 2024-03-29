import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import MultiSelect from "./MultiSelect";
import { createStudyRecruitment } from "../../services/StudyRecruitmentService";


export default function StudyRecruitment() {

  const [selectedDays, setSelectedDays] = useState([]); // 선택한 요일을 저장하는 배열
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);

  // 요일 목록
  const daysOfWeek = [
    { id: 'monday', label: '월요일' },
    { id: 'tuesday', label: '화요일' },
    { id: 'wednesday', label: '수요일' },
    { id: 'thursday', label: '목요일' },
    { id: 'friday', label: '금요일' },
    { id: 'saturday', label: '토요일' },
    { id: 'sunday', label: '일요일' },
  ];

  const handleCheckboxChange = (e) => {
    const dayId = e.target.id;
    const isChecked = e.target.checked;

    if (isChecked) {
      // 선택한 요일을 추가
      setSelectedDays([...selectedDays, dayId]);
    } else {
      // 선택한 요일을 제거
      setSelectedDays(selectedDays.filter((day) => day !== dayId));
    }
  };

  const isValidTimeFormat = (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  // 분 단위의 시간을 HH:MM 형식의 문자열로 변환하는 함수
  const convertToHHMM = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (timeInMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 출석인정 시간
  const [startTime, setStartTime] = useState(""); // 출석 인정 시작 시간
  const [endTime, setEndTime] = useState(""); // 출석 인정 종료 시간

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };


  // 초기값 세팅 부분
  const [write, setWrite] = useState({
    studyName: "",
    title: "",
    description: "",
    skills: [],
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    studyDay:"",
    maxNum: "",
    userId: authData.id,
  });

  const handleCustomSelectChange = (selectedOptions) => {
  console.log('selectedOptions 확인 @@ : ', selectedOptions);
  setSelectedSkills(selectedOptions);
  };


  const submitWrite = async (e) => {
    e.preventDefault();

    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      alert("시간을 입력해주세요.");

      return;
    }

    try {

        const dayId = e.target.id;
        const isChecked = e.target.checked;
      
        if (isChecked) {
          // 선택한 요일을 추가
          setSelectedDays([...selectedDays, dayId]);
        } else {
          // 선택한 요일을 제거
          setSelectedDays(selectedDays.filter((day) => day !== dayId));
        }
      
      const formattedStartTime = convertToHHMM(
        parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1])
      );
      const formattedEndTime = convertToHHMM(
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1])
      );

      const combinedSkills = [...selectedSkills, write.skills].filter(Boolean);
      // const combinedSkills = [...selectedSkills, write.skills];
    
     
      const studyRecruitmentData = {
        ...write,
        skills: combinedSkills,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        studyDay:selectedDays,

        // 다른 필드들도 추가해야 함
      };
      console.log('아 정말 하기 싫다 진짜 : ',studyRecruitmentData);

      const response = await createStudyRecruitment(studyRecruitmentData);

      // 성공 처리: response를 이용하여 처리
      console.log("스터디 모집 글 작성 완료", response);

      navigate("/"); // 목록 페이지 경로로 변경
      // 필요한 리디렉션 또는 다른 동작 수행
    } catch (error) {
      // 오류 처리
      console.error("스터디 모집 글 작성 중 오류 발생", error);
    }
  };

  return (
    <form onSubmit={submitWrite} className="mx-auto mt-16 max-w-xl sm:mt-20">
      <div className="flex gap-x-3">
        <div className="sm:col-span-2">
          <div class="w-48">
            <label
              htmlFor="maxNum"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              모집인원
            </label>
            <select
              id="maxNum"
              name="maxNum"
              value={write.maxNum}
              onChange={(e) => setWrite({ ...write, maxNum: e.target.value })}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">선택</option>
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명</option>
              <option value="6">6명</option>
              <option value="7">7명</option>
              <option value="8">8명</option>
              <option value="9">9명</option>
              <option value="10">10명 이상</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="w-48">
            <label
              htmlFor="skills"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              모집구분
            </label>

            <select
              id="skills"
              name="skills"
              value={write.skills}
              onChange={(e) => setWrite({ ...write, skills: e.target.value })}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-"
            >
              <option>선택</option>
              <option value="frontEnd">frontend</option>
              <option value="backEnd">backend</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          스터디 시작 날짜
        </label>
        <div className="mt-1">
          <input
            value={write.startDate}
            onChange={(e) => setWrite({ ...write, startDate: e.target.value })}
            type="date"
            name="startDate"
            id="startDate"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          스터디 종료 날짜
        </label>
        <div className="mt-1">
          <input
            value={write.endDate}
            onChange={(e) => setWrite({ ...write, endDate: e.target.value })}
            type="date"
            name="endDate"
            id="endDate"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            출석 인정 시작 시간
          </label>
          <div className="mt-2.5 mb-4 relative rounded-md shadow-sm">
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            출석 인정 마지막 시간
          </label>
          <div className="mt-2.5 mb-4 w-full relative rounded-md shadow-sm">
            <input type="time" value={endTime} onChange={handleEndTimeChange} />
          </div>
        </div>
      </div>
      <div>
      <label
            htmlFor="studyDay"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            스터디 진행 요일
          </label>
      <div>
        {daysOfWeek.map((day) => (
          <label key={day.id}>
            <input
              type="checkbox"
              id={day.id}
              value={write.studyDay}
              checked={selectedDays.includes(day.id)}
              onChange={handleCheckboxChange}
            />
            {day.label}
          </label>
        ))}
      </div>
      <p> {selectedDays.join(', ')}</p>
    </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="studyName"
          className="block text-sm font-semibold leading-2 text-gray-900"
        >
          스터디 이름
        </label>
        <div className="mt-2.5 mb-4">
          <input
            value={write.studyName}
            onChange={(e) => setWrite({ ...write, studyName: e.target.value })}
            type="text"
            name="studyName"
            id="studyName"
            autoComplete="studyName"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="skills"
          className="block text-sm font-semibold leading-2 text-gray-900"
        >
          기술 스택 선정 
        </label>
      </div>
      <MultiSelect name="skills" onChange={handleCustomSelectChange} />
      <div className="sm:col-span-2 mt-2.5">
        <label
          htmlFor="title"
          className="block text-sm font-semibold leading-3 text-gray-900"
        >
          제목
        </label>
        <div className="mt-2.5">
          <input
            value={write.title}
            onChange={(e) => setWrite({ ...write, title: e.target.value })}
            type="text"
            name="title"
            id="title"
            autoComplete="title"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <div className="mt-2.5">
          <textarea
            value={write.description}
            onChange={(e) =>
              setWrite({ ...write, description: e.target.value })
            }
            name="description"
            id="description"
            rows={11}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={""}
          />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-x-3">
          <button
            type="reset"
            onClick={() => navigate("/")}
            className="flex-1 rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            작성완료
          </button>
        </div>
      </div>
    </form>
  );
}
