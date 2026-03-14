import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Panchang, Kundali, StripeConfiguration, ShoppingItem, ChatSession } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['freeTrialActive'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsFreeTrialActive() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['freeTrialActive'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isFreeTrialActive();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCoinBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCoinBalance(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetKundali() {
  const { actor, isFetching } = useActor();

  return useQuery<Kundali | null>({
    queryKey: ['kundali'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKundali();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveKundali() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kundali: Kundali) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveKundali(kundali);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kundali'] });
    },
  });
}

export function useGetAllPanchang() {
  const { actor, isFetching } = useActor();

  return useQuery<Panchang[]>({
    queryKey: ['panchang'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPanchang();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPanchang() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (panchang: Panchang) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPanchang(panchang);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panchang'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useUpdateSubscriptionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isPremium: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscriptionStatus(isPremium);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['freeTrialActive'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartChatSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.startChatSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChatSession'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useEndChatSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.endChatSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChatSession'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetActiveChatSession() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatSession | null>({
    queryKey: ['activeChatSession'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActiveChatSession();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds to update timer
  });
}

export function useGetRatePerMinute() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['ratePerMinute'],
    queryFn: async () => {
      if (!actor) return BigInt(5);
      return actor.getRatePerMinute();
    },
    enabled: !!actor && !isFetching,
  });
}
