import { useFeatureFlags } from "../useFeatureFlags";

// @ts-ignore
const { enableTransactionsSomeFeature, enableTransactionsSomeOtherFeature } =
  useFeatureFlags();
