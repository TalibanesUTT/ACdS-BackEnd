export enum AppointmentStatus {
    AppointmentsPending = "Pendiente",
    AppointmentsCancelled = "Cancelada",
    AppointmentsCompleted = "Completada",
}

export enum ServiceOrderStatus {
    ServiceOrdersReceived = "Recibido",
    ServiceOrdersUnderReview = "En revisión",
    ServiceOrdersIssued = "Emitido",
    ServiceOrdersApproved = "Aprobado",
    ServiceOrdersInProgress = "En proceso",
    ServiceOrdersUnderCheck = "En chequeo",
    ServiceOrdersCompleted = "Completado",
    ServiceOrdersReadyToPickUp = "Listo para recoger",
    ServiceOrdersDelivered = "Entregado",
    ServiceOrdersFinished = "Finalizado",
    ServiceOrdersOnHold = "En espera",
    ServiceOrdersCancelled = "Cancelado",
}