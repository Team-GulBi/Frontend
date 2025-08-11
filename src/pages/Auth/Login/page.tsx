import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login, { LoginRequest } from '@/apis/login';
import { LoginHeader } from '@/components/common/Header';

const LoginPage = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (!fields.email || !fields.password) {
      setErrorMessage('* 아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      await login(fields);
      navigate('/');
    } catch (error: any) {
      setErrorMessage('* 아이디와 비밀번호가 일치하지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <LoginHeader />
      <div className="flex w-full items-center justify-center gap-[10rem] p-[18rem]">
        <div className="flex w-1/2 flex-col gap-[2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              로그인
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              가입하신 아이디로 로그인해주세요
            </span>
          </div>
          <div className="flex w-4/5 flex-col gap-[1rem]">
            <input
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="아이디"
              className="rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
            />
            <input
              name="password"
              type="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
            />
          </div>
          <div className="flex w-4/5 flex-col gap-3">
            {errorMessage && (
              <div className="text-xxsmall16 text-center text-error">
                {errorMessage}
              </div>
            )}
            <button
              className={`flex w-full items-center justify-center rounded-xs border border-neutral-80 bg-secondary-dark p-2 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={loading ? undefined : handleLogin}
              disabled={loading}
            >
              <span className="text-small16 text-primary-0">
                {loading ? '로그인 중...' : '로그인'}
              </span>
            </button>
          </div>
        </div>
        <div className="flex w-1/3 flex-col gap-[2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              회원가입
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              아직 회원이 아니신가요?
            </span>
          </div>
          <a
            className="justify-center rounded-xs bg-secondary-dark p-2 text-center text-primary-0"
            href="/signup"
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
