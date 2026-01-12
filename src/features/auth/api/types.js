// [혜린] Auth API 타입 정의 및 상수

/**
 * [혜린] 가게 카테고리 Enum
 */
export const SHOP_CATEGORIES = {
  KOREAN: 'KOREAN',
  CHINESE: 'CHINESE',
  JAPANESE: 'JAPANESE',
  WESTERN: 'WESTERN',
  CAFE_DESSERT: 'CAFE_DESSERT',
  BAR: 'BAR',
  ETC: 'ETC',
};

/**
 * [혜린] 회원가입 데이터 예시
 * @typedef {Object} SignupData
 * @property {string} email - 이메일
 * @property {string} password - 비밀번호 (8자 이상)
 * @property {string} passwordConfirm - 비밀번호 확인
 * @property {string} name - 사장님 실명
 * @property {string} [phone] - 휴대폰 번호 (선택)
 * @property {boolean} privacyAgreed - 개인정보 동의
 * @property {ShopInfo} shopInfo - 가게 정보
 */

/**
 * [혜린] 가게 정보
 * @typedef {Object} ShopInfo
 * @property {string} name - 가게 상호명
 * @property {string} address - 가게 주소
 * @property {string} category - 가게 카테고리 (SHOP_CATEGORIES 중 하나)
 * @property {string|null} customCategory - ETC일 때만 입력
 */

/**
 * [혜린] 로그인 데이터 예시
 * @typedef {Object} LoginData
 * @property {string} email - 이메일
 * @property {string} password - 비밀번호
 */

/**
 * [혜린] 회원가입 데이터 생성 헬퍼
 */
export const createSignupData = ({
  email,
  password,
  passwordConfirm,
  name,
  phone = '',
  privacyAgreed = true,
  shopName,
  shopAddress,
  shopCategory,
  customCategory = null,
}) => {
  return {
    email,
    password,
    passwordConfirm,
    name,
    phone,
    privacyAgreed,
    shopInfo: {
      name: shopName,
      address: shopAddress,
      category: shopCategory,
      customCategory,
    },
  };
};

/**
 * [혜린] 로그인 데이터 생성 헬퍼
 */
export const createLoginData = (email, password) => {
  return {
    email,
    password,
  };
};
