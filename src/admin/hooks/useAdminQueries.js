import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getUserDailyStats } from "../../api/adminService";
import { listUsers, getUser } from "../../api/usersAdminService";
import { getPaymentStats, listPayments, listSubscriptions } from "../../api/adminPaymentsService";
import { listAuditLog } from "../../api/auditLogService";
import { getCostSummary, getCostTrend, getCostLedger } from "../../api/costsService";

export const useDashboardStats = (params) =>
  useQuery({
    queryKey: ["admin", "dashboard-stats", params],
    queryFn: () => getDashboardStats(params),
  });

export const useUserDailyStats = (userId, params) =>
  useQuery({
    queryKey: ["admin", "user-stats", userId, params],
    queryFn: () => getUserDailyStats(userId, params),
    enabled: !!userId,
  });

export const useUsersList = (params) =>
  useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => listUsers(params),
  });

export const useUserDetail = (id) =>
  useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

export const usePaymentStats = (params) =>
  useQuery({
    queryKey: ["admin", "payment-stats", params],
    queryFn: () => getPaymentStats(params),
  });

export const usePaymentsList = (params) =>
  useQuery({
    queryKey: ["admin", "payments", params],
    queryFn: () => listPayments(params),
  });

export const useSubscriptionsList = (params) =>
  useQuery({
    queryKey: ["admin", "subscriptions", params],
    queryFn: () => listSubscriptions(params),
  });

export const useAuditLog = (params) =>
  useQuery({
    queryKey: ["admin", "audit-log", params],
    queryFn: () => listAuditLog(params),
  });

export const useCostSummary = (params) =>
  useQuery({
    queryKey: ["admin", "cost-summary", params],
    queryFn: () => getCostSummary(params),
  });

export const useCostTrend = (params) =>
  useQuery({
    queryKey: ["admin", "cost-trend", params],
    queryFn: () => getCostTrend(params),
  });

export const useCostLedger = (params) =>
  useQuery({
    queryKey: ["admin", "cost-ledger", params],
    queryFn: () => getCostLedger(params),
  });
