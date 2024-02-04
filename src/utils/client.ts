import {
  Api,
  DailySalesOverviewResponse,
  DailySalesSkuListResponse,
  LoginResponse,
  LogoutResponse,
  GetSkuRefundRate as GetSkuRefundRateType,
} from "@/generated/types";
import createApiClient from "./api";
createApiClient();

const api = (global as any).api as Api<string>;

type Login = ({
  Email,
  Password,
}: Parameters<typeof api.oauth.tokenCreate>[0]) => Promise<string | undefined>;

type Logout = () => Promise<LogoutResponse | undefined>;

type GetUser = ({
  email,
}: Parameters<typeof api.user.userInformationCreate>[0]) => Promise<
  LoginResponse["Data"] | undefined
>;

type GetDailySales = ({
  day,
  marketplace,
  sellerId,
}: Parameters<typeof api.data.dailySalesOverviewCreate>[0]) => Promise<
  DailySalesOverviewResponse["Data"] | undefined
>;

type GetDailySaleDetails = ({
  isDaysCompare,
  pageNumber,
  pageSize,
  sellerId,
  marketplace,
  salesDate,
  salesDate2,
}: Parameters<typeof api.data.dailySalesSkuListCreate>[0]) => Promise<
  DailySalesSkuListResponse["Data"] | undefined
>;

type GetSkuRefundRate = ({
  marketplace,
  sellerId,
  skuList,
}: Parameters<typeof api.data.getSkuRefundRateCreate>[0]) => Promise<
  GetSkuRefundRateType["Data"]
>;

export const client = () => {
  const login: Login = async ({ Email, Password }) => {
    try {
      const response = await api.oauth.tokenCreate(
        {
          Email,
          Password,
          GrantType: "password",
          Scope: "amazon_data",
          ClientId: "C0001",
          ClientSecret: "SECRET0001",
          RedirectUri: "https://api.eva.guru",
        },
        {
          next: {
            revalidate: 0,
          },
        }
      );

      if (response.data.Data?.AccessToken) {
        api.setSecurityData("Bearer " + response.data.Data?.AccessToken);
      }

      return response.data.Data?.AccessToken;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logout: Logout = async () => {
    const response = await api.user.logoutCreate({});
    api.setSecurityData("");

    return response.data.Data;
  };

  const getUser: GetUser = async ({ email }) => {
    const response = await api.user.userInformationCreate({
      email,
    });
    return response.data.Data;
  };

  const getDailySales: GetDailySales = async ({
    day,
    marketplace,
    sellerId,
  }) => {
    const response = await api.data.dailySalesOverviewCreate(
      {
        day,
        excludeYoYData: true,
        marketplace,
        requestStatus: 0,
        sellerId,
      },
      {
        next: {
          revalidate: 60 * 60 * 24 * 7, // 7 days
        },
      }
    );
    return response.data.Data;
  };

  const getDailySaleDetails: GetDailySaleDetails = async ({
    isDaysCompare,
    pageNumber,
    pageSize = 30,
    sellerId,
    marketplace,
    salesDate,
    salesDate2,
  }) => {
    const response = await api.data.dailySalesSkuListCreate({
      isDaysCompare,
      pageSize,
      pageNumber,
      salesDate,
      salesDate2,
      sellerId,
      marketplace,
    });

    return response.data.Data;
  };

  const getSkuRefundRate: GetSkuRefundRate = async ({
    marketplace,
    sellerId,
    skuList,
    requestedDay,
  }) => {
    const response = await api.data.getSkuRefundRateCreate({
      sellerId,
      marketplace,
      skuList,
      requestedDay,
    });

    return response.data.Data;
  };

  return {
    getUser,
    getDailySales,
    getDailySaleDetails,
    getSkuRefundRate,
    login,
    logout,
  };
};
