/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginResponse {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: {
    token?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      countryCode?: string;
      callingCode?: string;
      telephoneNumber?: string;
      isAdmin?: string;
      store?: {
        storeName?: string;
        storeId?: string;
        evaStoreId?: string;
        storeType?: number;
        region?: string;
        paidStatus?: number;
        pricingStatus?: number;
        /** @format date-time */
        paidDate?: string;
        /** @format date-time */
        reimbursementPackageTrialEndDate?: string;
        /** @format date-time */
        linkedDate?: string;
        marketplaceName?: string;
        marketplaceCode?: string;
        enableRepricing?: boolean;
      }[];
    };
    /** @format float */
    remainingReimbursementCredit?: number;
    /** @format float */
    monthlyReimbursementPackageCredit?: number;
    packageInformation?: {
      turnoverPackageInformation?: {
        pricingStatus?: number;
        packageName?: string;
        /** @format float */
        monthlyFee?: number;
        /** @format float */
        lowerLimit?: number;
        /** @format float */
        upperLimit?: number;
        /** @format float */
        reimbursementCredit?: number;
      };
      skuPackageInformation?: {
        packageName?: string;
        skuChargeFee?: number;
      };
    };
    isLinkAccount?: boolean;
    linkAccountParameters?: {
      developerName?: string;
      accountNumber?: string;
    };
  };
}

export interface LogoutResponse {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: any;
}

export interface TokenResponse {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: {
    AccessToken?: string;
    RefreshToken?: string;
    TokenType?: string;
    ExpiresAt?: string;
  };
}

export interface DailySalesOverviewResponse {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: {
    Currency?: string;
    item?: {
      date?: string;
      /** @format float */
      amount?: number;
      orderCount?: number;
      unitCount?: number;
      /** @format float */
      avgSalesPrev30Days?: number;
      prevYearDate?: string;
      /** @format float */
      prevYearAmount?: number;
      prevYearOrderCount?: number;
      prevYearUnitCount?: number;
      /** @format float */
      prevYearAvgSalesPrev30Days?: number;
      /** @format float */
      profit?: number;
      /** @format float */
      yoy30DailySalesGrowth?: number;
      /** @format float */
      acos?: number;
      /** @format float */
      fbaAmount?: number;
      /** @format float */
      fbmAmount?: number;
      /** @format float */
      fbaShippingAmount?: number;
    }[];
    isYoyExist?: boolean;
  };
}

export interface DailySalesSkuListResponse {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: {
    Currency?: string;
    item?: {
      selectedDate?: string;
      /** @format float */
      TotalSale?: number;
      skuList?: {
        sku?: string;
        productName?: string;
        qty?: number;
        shippingAmount?: number;
        /** @format float */
        amount?: number;
        /** @format float */
        refundPercantage?: number;
        qty2?: number;
        /** @format float */
        amount2?: number;
      }[];
      selectedDate2?: string;
      /** @format float */
      TotalSale2?: number;
    };
  };
}

export interface GetSkuRefundRate {
  ApiStatus?: boolean;
  ApiStatusCode?: string;
  ApiStatusMessage?: string;
  Data?: {
    item?: {
      sku?: string;
      /** @format float */
      refundRate?: number;
    }[];
  };
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};

    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Eva-Commerce Case Study API
 * @version 1
 * @license MIT (https://opensource.org/licenses/MIT)
 *
 * Eva Commerce website and case study app api
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  oauth = {
    /**
     * No description
     *
     * @tags Oauth
     * @name TokenCreate
     * @summary Access Token
     * @request POST:/oauth/token
     */
    tokenCreate: (
      body: {
        /** Email address */
        Email?: string;
        /**
         * User password
         * @format password
         */
        Password?: string;
        /** Grant Type */
        GrantType?: string;
        /** Scope */
        Scope?: string;
        /** Client Id */
        ClientId?: string;
        /** Client Secret */
        ClientSecret?: string;
        /** Redirect Uri */
        RedirectUri?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<TokenResponse, TokenResponse>({
        path: `/oauth/token`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name LogoutCreate
     * @summary User Logout
     * @request POST:/user/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<LogoutResponse, LogoutResponse>({
        path: `/user/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserInformationCreate
     * @summary User Login Information
     * @request POST:/user/user-information
     * @secure
     */
    userInformationCreate: (
      body: {
        /** Email address */
        email?: string;
      },
      params: RequestParams = {}
    ) => {
      return this.request<LoginResponse, LoginResponse>({
        path: `/user/user-information`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      });
    },
  };
  data = {
    /**
     * No description
     *
     * @tags Sales Analytics
     * @name DailySalesOverviewCreate
     * @summary Daily Sales Overview data
     * @request POST:/data/daily-sales-overview/
     * @secure
     */
    dailySalesOverviewCreate: (
      body: {
        /** marketplace name */
        marketplace?: string;
        /** Store ID */
        sellerId?: string;
        /** Store ID */
        requestStatus?: number;
        /** data duration to be created */
        day?: number;
        /** Desktop feature exists or not */
        excludeYoYData?: boolean;
      },
      params: RequestParams = {}
    ) =>
      this.request<DailySalesOverviewResponse, DailySalesOverviewResponse>({
        path: `/data/daily-sales-overview/`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sales Analytics
     * @name DailySalesSkuListCreate
     * @summary Daily Sales Sku List data
     * @request POST:/data/daily-sales-sku-list/
     * @secure
     */
    dailySalesSkuListCreate: (
      body: {
        /** Marketplace name */
        marketplace?: string;
        /** Store ID */
        sellerId?: string;
        /**
         * Requested sales date.If single day sku list request send day this parameter name
         * @format date
         */
        salesDate?: string;
        /**
         * Send only if comparison days sku list selected. Second selected request date.
         * @format date
         */
        salesDate2?: string;
        /** Requested page size */
        pageSize?: number;
        /** Requested page number */
        pageNumber?: number;
        /** Comparison days sku list or single day sku list. For comparison send '1' , for single day send '0' */
        isDaysCompare?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<DailySalesSkuListResponse, DailySalesSkuListResponse>({
        path: `/data/daily-sales-sku-list/`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sales Analytics
     * @name GetSkuRefundRateCreate
     * @summary Get Sku Refund Rate
     * @request POST:/data/get-sku-refund-rate/
     * @secure
     */
    getSkuRefundRateCreate: (
      body: {
        /** Marketplace name */
        marketplace?: string;
        /** Store ID */
        sellerId?: string;
        /** Sku List */
        skuList?: string[];
        /** Requested day */
        requestedDay?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<GetSkuRefundRate, GetSkuRefundRate>({
        path: `/data/get-sku-refund-rate/`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
