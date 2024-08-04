import { ServiceOrderStatus } from "@/constants/values-constants";

export const ServiceOrderStatusFlow: ServiceOrderStatus[] = [
    ServiceOrderStatus.ServiceOrdersReceived,
    ServiceOrderStatus.ServiceOrdersUnderReview,
    ServiceOrderStatus.ServiceOrdersIssued,
    ServiceOrderStatus.ServiceOrdersApproved,
    ServiceOrderStatus.ServiceOrdersInProgress,
    ServiceOrderStatus.ServiceOrdersUnderCheck,
    ServiceOrderStatus.ServiceOrdersCompleted,
    ServiceOrderStatus.ServiceOrdersReadyToPickUp,
    ServiceOrderStatus.ServiceOrdersDelivered,
    ServiceOrderStatus.ServiceOrdersFinished
]