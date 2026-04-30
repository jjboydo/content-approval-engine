export type Locale = "es" | "en";

export const translations = {
    es: {
        // App header
        appName: "Aprobación de Contenido",
        appSubtitle: "Panel de Agencia",
        toggleTheme: "Cambiar tema",
        // Auth
        signOut: "Cerrar sesión",
        signingOut: "Saliendo…",
        // Dashboard form
        newContent: "Nuevo Contenido",
        newContentDesc: "Publica un video para que el cliente lo revise y apruebe.",
        titleLabel: "Título",
        titlePlaceholder: "Video campaña Q2…",
        urlLabel: "URL del Video",
        urlPlaceholder: "https://youtube.com/watch?v=…",
        publish: "Publicar",
        publishing: "Publicando…",
        // Dashboard stats & labels
        sentContent: "Contenido Enviado",
        piece: "pieza",
        pieces: "piezas",
        total: "en total",
        pending: "Pendiente",
        approved: "Aprobado",
        rejected: "Rechazado",
        pendingPlural: "pendientes",
        approvedPlural: "aprobados",
        rejectedPlural: "rechazados",
        // Dashboard card
        viewReview: "Ver revisión",
        copyLink: "Copiar enlace",
        // Dashboard toasts
        linkCopied: "Enlace copiado al portapapeles.",
        copyError: "No se pudo copiar el enlace.",
        createError: "No se pudo crear el contenido. Intenta de nuevo.",
        createSuccess: "Contenido publicado correctamente.",
        fillFields: "Por favor, completa todos los campos.",
        // Dashboard empty state
        emptyTitle: "Aún no hay contenido",
        emptyDesc: "Crea tu primera pieza de contenido usando el formulario de arriba.",
        // Review page header
        reviewSubtitle: "Revisión del cliente",
        backToPanel: "Volver al panel",
        // Review page status labels
        statusPending: "Pendiente de revisión",
        statusApproved: "Aprobado",
        statusRejected: "Rechazado",
        // Review page content
        publishedOn: "Publicado el",
        // Review page decision card
        decisionTitle: "Tu Decisión",
        decisionDescDone: "Ya se registró una decisión para este contenido.",
        decisionDescPending: "Aprueba este contenido o recházalo con comentarios para el equipo.",
        // Review page banners
        approvedBannerTitle: "Contenido aprobado",
        approvedBannerDesc: "Este contenido ha sido marcado como aprobado. El equipo ha sido notificado.",
        rejectedBannerTitle: "Contenido rechazado",
        rejectedBannerDesc: "Tu feedback ha sido registrado y enviado al equipo de producción.",
        // Review page feedback section
        sentFeedback: "Comentario enviado",
        feedbackLabel: "Comentario para el equipo",
        feedbackPlaceholder: "Describe qué necesita cambiarse o mejorarse…",
        characters: "caracteres",
        // Review page buttons
        approveBtn: "Aprobar",
        approvingBtn: "Aprobando…",
        rejectBtn: "Rechazar",
        confirmRejectBtn: "Confirmar rechazo",
        sendingBtn: "Enviando…",
        cancelBtn: "Cancelar",
        // Review page toasts
        toastApproved: "Contenido aprobado.",
        toastApproveError: "No se pudo aprobar el contenido. Intenta de nuevo.",
        toastRejected: "Feedback enviado correctamente.",
        toastRejectError: "No se pudo enviar el rechazo. Intenta de nuevo.",
        toastFeedbackRequired: "Escribe un comentario antes de enviar el rechazo.",
        // Not found
        notFoundTitle: "Contenido no encontrado",
        notFoundDesc: "Este enlace de revisión no es válido o el contenido fue eliminado.",
    },
    en: {
        // App header
        appName: "Content Approval",
        appSubtitle: "Agency Panel",
        toggleTheme: "Toggle theme",
        // Auth
        signOut: "Sign out",
        signingOut: "Signing out…",
        // Dashboard form
        newContent: "New Content",
        newContentDesc: "Publish a video for the client to review and approve.",
        titleLabel: "Title",
        titlePlaceholder: "Q2 campaign video…",
        urlLabel: "Video URL",
        urlPlaceholder: "https://youtube.com/watch?v=…",
        publish: "Publish",
        publishing: "Publishing…",
        // Dashboard stats & labels
        sentContent: "Submitted Content",
        piece: "piece",
        pieces: "pieces",
        total: "total",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        pendingPlural: "pending",
        approvedPlural: "approved",
        rejectedPlural: "rejected",
        // Dashboard card
        viewReview: "View review",
        copyLink: "Copy link",
        // Dashboard toasts
        linkCopied: "Link copied to clipboard.",
        copyError: "Could not copy the link.",
        createError: "Could not create content. Please try again.",
        createSuccess: "Content published successfully.",
        fillFields: "Please fill in all fields.",
        // Dashboard empty state
        emptyTitle: "No content yet",
        emptyDesc: "Create your first piece of content using the form above.",
        // Review page header
        reviewSubtitle: "Client Review",
        backToPanel: "Back to panel",
        // Review page status labels
        statusPending: "Pending review",
        statusApproved: "Approved",
        statusRejected: "Rejected",
        // Review page content
        publishedOn: "Published on",
        // Review page decision card
        decisionTitle: "Your Decision",
        decisionDescDone: "A decision has already been recorded for this content.",
        decisionDescPending: "Approve this content or reject it with feedback for the team.",
        // Review page banners
        approvedBannerTitle: "Content approved",
        approvedBannerDesc: "This content has been marked as approved. The team has been notified.",
        rejectedBannerTitle: "Content rejected",
        rejectedBannerDesc: "Your feedback has been recorded and sent to the production team.",
        // Review page feedback section
        sentFeedback: "Submitted feedback",
        feedbackLabel: "Feedback for the team",
        feedbackPlaceholder: "Describe what needs to be changed or improved…",
        characters: "characters",
        // Review page buttons
        approveBtn: "Approve",
        approvingBtn: "Approving…",
        rejectBtn: "Reject",
        confirmRejectBtn: "Confirm rejection",
        sendingBtn: "Sending…",
        cancelBtn: "Cancel",
        // Review page toasts
        toastApproved: "Content approved.",
        toastApproveError: "Could not approve the content. Please try again.",
        toastRejected: "Feedback submitted successfully.",
        toastRejectError: "Could not send the rejection. Please try again.",
        toastFeedbackRequired: "Write a comment before sending the rejection.",
        // Not found
        notFoundTitle: "Content not found",
        notFoundDesc: "This review link is not valid or the content was deleted.",
    },
} satisfies Record<Locale, Record<string, string>>;
