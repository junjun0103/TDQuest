import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserDataType } from "../../Types/generalTypes";
import { TDQuestAPI } from "../../API/tdquestAPI";

export interface SignUserInfo {
  status: string;
  userInfo: UserDataType;
  characterInfo: object;
}

export const initialState: SignUserInfo = {
  status: "",
  userInfo: {} as UserDataType,
  characterInfo: {},
};

export const signIn = createAsyncThunk("sign/in", async (data: any) => {
  try {
    const response = await TDQuestAPI.post(`/log/in`, data);
    const isLogin = { status: "loggedIn", ...response.data };
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
    localStorage.setItem(
      "accessToken",
      JSON.stringify(response.data.accessToken)
    );
    return isLogin;
  } catch (err: any) {
    console.log(err.response);
    return { status: "failed" };
  }
});

export const signOauth = createAsyncThunk("sign/oauth", async (url : any)=>{
  try {
    const search = String(url).includes('google')
    const response = search? await TDQuestAPI.get(`/oauth/google/callback?code=${url.searchParams.get('code')}`) : await TDQuestAPI.get(`/oauth/kakao/callback?code=${url.searchParams.get('code')}`)
    const isLogin = { status: "loggedIn", ...response.data};
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
    console.log('test')
    return isLogin;
  } catch (err: any) {
    console.log(err.response);
    return { status: "failed" };
  }
})

export const signUp = createAsyncThunk("sign/up", async (data: any) => {
  try {
    const response = await TDQuestAPI.post(`/sign/in`, data);
    console.log(response);
    window.location.href = "/sign";
    alert("회원가입 완료!");
  } catch (err: any) {
    console.log(err.response.status);
    if (err.response.status === 409) {
      alert("이미 존재하는 아이디가 있습니다.");
    }
  }
});

export const signSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    })
    .addCase(signOauth.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export default signSlice.reducer;
