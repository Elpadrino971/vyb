/**
 * French translations - Français
 */

export default {
  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    refresh: 'Actualiser',
    retry: 'Réessayer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    seeAll: 'Voir tout',
    seeMore: 'Voir plus',
    seeLess: 'Voir moins',
    share: 'Partager',
    copy: 'Copier',
    copied: 'Copié !',
    download: 'Télécharger',
    upload: 'Uploader',
    free: 'Gratuit',
    popular: 'Populaire',
    new: 'Nouveau',
    live: 'EN DIRECT',
    replay: 'Replay',
    soon: 'Bientôt',
    today: 'Aujourd\'hui',
    tomorrow: 'Demain',
    yesterday: 'Hier',
  },

  // Navigation
  nav: {
    home: 'Accueil',
    explore: 'Explorer',
    tickets: 'Billets',
    profile: 'Profil',
    settings: 'Paramètres',
    notifications: 'Notifications',
  },

  // Auth
  auth: {
    login: 'Connexion',
    logout: 'Déconnexion',
    signup: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    createAccount: 'Créer un compte',
    alreadyHaveAccount: 'Déjà un compte ?',
    noAccount: 'Pas encore de compte ?',
    fullName: 'Nom complet',
    username: 'Nom d\'utilisateur',
    phone: 'Téléphone',

    // Validation messages
    emailRequired: 'L\'email est requis',
    emailInvalid: 'Email invalide',
    passwordRequired: 'Le mot de passe est requis',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordNoUppercase: 'Le mot de passe doit contenir une majuscule',
    passwordNoLowercase: 'Le mot de passe doit contenir une minuscule',
    passwordNoNumber: 'Le mot de passe doit contenir un chiffre',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    nameRequired: 'Le nom est requis',
    nameTooShort: 'Le nom doit contenir au moins 2 caractères',

    // Success/Error messages
    loginSuccess: 'Connexion réussie !',
    loginError: 'Échec de la connexion',
    signupSuccess: 'Compte créé avec succès !',
    signupError: 'Échec de l\'inscription',
    logoutSuccess: 'Déconnexion réussie',
    resetEmailSent: 'Email de réinitialisation envoyé',
    tooManyAttempts: 'Trop de tentatives. Veuillez réessayer dans {{minutes}} minute(s).',

    // Welcome messages
    welcomeBack: 'Bon retour !',
    welcomeNew: 'Bienvenue sur Vybzzz !',
    loginSubtitle: 'Connectez-vous pour accéder aux concerts',
    signupSubtitle: 'Créez votre compte pour découvrir des concerts exclusifs',
  },

  // Home
  home: {
    title: 'Accueil',
    welcome: 'Bienvenue, {{name}} !',
    liveNow: 'En direct maintenant',
    upcoming: 'À venir',
    trending: 'Tendances',
    recommended: 'Recommandé pour vous',
    recentlyWatched: 'Vus récemment',
    genres: 'Genres',
    allGenres: 'Tous les genres',
    noLiveConcerts: 'Aucun concert en direct',
    noUpcomingConcerts: 'Aucun concert à venir',
    discoverConcerts: 'Découvrez les concerts',
  },

  // Concerts
  concert: {
    title: 'Concert',
    concerts: 'Concerts',
    live: 'EN DIRECT',
    upcoming: 'À venir',
    past: 'Passés',
    details: 'Détails du concert',
    artist: 'Artiste',
    date: 'Date',
    time: 'Heure',
    duration: 'Durée',
    genre: 'Genre',
    venue: 'Lieu',
    description: 'Description',
    viewers: '{{count}} spectateurs',
    watchNow: 'Regarder maintenant',
    buyTicket: 'Acheter un billet',
    getTicket: 'Obtenir un billet',
    addToCalendar: 'Ajouter au calendrier',
    shareEvent: 'Partager l\'événement',
    setReminder: 'Définir un rappel',
    reminderSet: 'Rappel défini !',
    startingSoon: 'Commence bientôt',
    startsIn: 'Commence dans {{time}}',
    endedOn: 'Terminé le {{date}}',
    watchReplay: 'Voir le replay',
    replayAvailable: 'Replay disponible pendant {{days}} jours',
    replayExpired: 'Le replay a expiré',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    quality: 'Qualité',
    autoQuality: 'Auto',

    // Filters
    filterByGenre: 'Filtrer par genre',
    filterByDate: 'Filtrer par date',
    filterByPrice: 'Filtrer par prix',
    sortByDate: 'Trier par date',
    sortByPopularity: 'Trier par popularité',
    sortByPrice: 'Trier par prix',
  },

  // Tickets
  ticket: {
    title: 'Billet',
    tickets: 'Billets',
    myTickets: 'Mes billets',
    purchaseTicket: 'Acheter un billet',
    ticketDetails: 'Détails du billet',
    ticketType: 'Type de billet',
    ticketPrice: 'Prix du billet',
    quantity: 'Quantité',
    total: 'Total',
    subtotal: 'Sous-total',
    serviceFee: 'Frais de service',
    serviceFeeIncluded: 'Inclus',
    checkout: 'Paiement',
    confirmPurchase: 'Confirmer l\'achat',
    purchaseSuccess: 'Achat réussi !',
    purchaseError: 'Échec de l\'achat',
    ticketSent: 'Billet envoyé par email',
    showQRCode: 'Afficher le QR code',
    scanQRCode: 'Scanner le QR code',
    validTicket: 'Billet valide',
    invalidTicket: 'Billet invalide',
    usedTicket: 'Billet déjà utilisé',
    ticketNumber: 'N° de billet',
    purchaseDate: 'Date d\'achat',

    // Ticket types
    standard: 'Standard',
    reduced: 'Tarif réduit',
    premium: 'Premium',
    vip: 'VIP',

    // Status
    active: 'Actif',
    used: 'Utilisé',
    expired: 'Expiré',
    cancelled: 'Annulé',
    refunded: 'Remboursé',

    // Empty states
    noTickets: 'Aucun billet',
    noActiveTickets: 'Aucun billet actif',
    noPastTickets: 'Aucun billet passé',
    browseEvents: 'Parcourir les événements',
  },

  // Payment
  payment: {
    title: 'Paiement',
    checkout: 'Finaliser l\'achat',
    paymentMethod: 'Moyen de paiement',
    cardNumber: 'Numéro de carte',
    expiryDate: 'Date d\'expiration',
    cvv: 'CVV',
    cardHolder: 'Titulaire de la carte',
    billingAddress: 'Adresse de facturation',
    pay: 'Payer {{amount}}',
    processing: 'Traitement en cours...',
    paymentSuccess: 'Paiement réussi !',
    paymentFailed: 'Paiement échoué',
    paymentCancelled: 'Paiement annulé',
    securePayment: 'Paiement sécurisé avec chiffrement SSL',
    poweredByStripe: 'Paiement sécurisé par Stripe',
    tryAgain: 'Réessayer le paiement',

    // Confirmation
    confirmationTitle: 'Confirmation de paiement',
    confirmationMessage: 'Votre billet pour "{{concert}}" a été acheté.',
    emailConfirmation: 'Vous recevrez un email de confirmation avec votre QR code.',
    viewTickets: 'Voir mes billets',
  },

  // Artist / Pro
  artist: {
    title: 'Artiste',
    artists: 'Artistes',
    becomePro: 'Devenir artiste',
    proAccount: 'Compte Pro',
    dashboard: 'Tableau de bord',
    myEvents: 'Mes événements',
    createEvent: 'Créer un événement',
    analytics: 'Statistiques',
    earnings: 'Revenus',
    followers: 'Abonnés',
    following: 'Abonnements',
    follow: 'Suivre',
    unfollow: 'Ne plus suivre',
    verified: 'Vérifié',
    bio: 'Biographie',
    socialLinks: 'Réseaux sociaux',
    contactArtist: 'Contacter l\'artiste',

    // Stats
    totalViews: 'Vues totales',
    totalEarnings: 'Revenus totaux',
    totalConcerts: 'Concerts totaux',
    totalTicketsSold: 'Billets vendus',
  },

  // Subscriptions
  subscription: {
    title: 'Abonnement',
    choosePlan: 'Choisissez votre plan',
    currentPlan: 'Plan actuel',
    upgradePlan: 'Améliorer le plan',
    downgradePlan: 'Réduire le plan',
    cancelPlan: 'Annuler l\'abonnement',
    renewPlan: 'Renouveler l\'abonnement',

    // Plans
    smart: 'Smart',
    pro: 'Pro',
    premium: 'Premium',

    // Features
    perMonth: '/mois',
    revenueSplit: '{{percent}}% de vos revenus',
    unlimitedConcerts: 'Concerts illimités',
    hdStreaming: 'Streaming HD',
    uhdStreaming: 'Streaming 4K UHD',
    prioritySupport: 'Support prioritaire',
    analytics: 'Statistiques détaillées',
    customBranding: 'Branding personnalisé',
    multiCamera: 'Multi-caméra',
    vodAccess: 'Accès VOD {{days}} jours',
    exclusiveContent: 'Contenu exclusif',

    // Plan descriptions
    smartDesc: 'Idéal pour commencer',
    proDesc: 'Pour les artistes établis',
    premiumDesc: 'Pour les professionnels',

    // Actions
    subscribe: 'S\'abonner',
    subscribing: 'Traitement...',
    subscribeSuccess: 'Abonnement activé !',
    subscribeError: 'Échec de l\'abonnement',
    alreadySubscribed: 'Déjà abonné',

    // Cancellation
    cancelConfirm: 'Êtes-vous sûr de vouloir annuler ?',
    cancelWarning: 'Vous perdrez l\'accès à toutes les fonctionnalités premium.',
    cancelSuccess: 'Abonnement annulé',
  },

  // Settings
  settings: {
    title: 'Paramètres',
    account: 'Compte',
    preferences: 'Préférences',
    notifications: 'Notifications',
    privacy: 'Confidentialité',
    security: 'Sécurité',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    systemDefault: 'Système',
    about: 'À propos',
    help: 'Aide',
    faq: 'FAQ',
    contact: 'Contact',
    terms: 'Conditions d\'utilisation',
    privacy_policy: 'Politique de confidentialité',
    version: 'Version {{version}}',
    logout: 'Déconnexion',
    deleteAccount: 'Supprimer le compte',

    // Notifications settings
    pushNotifications: 'Notifications push',
    emailNotifications: 'Notifications email',
    concertReminders: 'Rappels de concerts',
    newFollowers: 'Nouveaux abonnés',
    promotions: 'Promotions',

    // Change language
    changeLanguage: 'Changer de langue',
    selectLanguage: 'Sélectionnez une langue',
  },

  // Profile
  profile: {
    title: 'Profil',
    editProfile: 'Modifier le profil',
    viewProfile: 'Voir le profil',
    profilePicture: 'Photo de profil',
    changePicture: 'Changer la photo',
    coverPhoto: 'Photo de couverture',
    changeCover: 'Changer la couverture',
    personalInfo: 'Informations personnelles',
    saveChanges: 'Enregistrer les modifications',
    changesSaved: 'Modifications enregistrées',
    memberSince: 'Membre depuis {{date}}',

    // Stats
    concertsWatched: 'Concerts vus',
    ticketsPurchased: 'Billets achetés',
    artistsFollowed: 'Artistes suivis',
  },

  // FAQ
  faq: {
    title: 'FAQ',
    subtitle: 'Questions fréquentes',
    searchPlaceholder: 'Rechercher une question...',
    noResults: 'Aucun résultat trouvé',

    // Categories
    general: 'Général',
    account: 'Compte',
    payments: 'Paiements',
    streaming: 'Streaming',
    tickets: 'Billets',
    artists: 'Artistes',
    technical: 'Technique',

    // Questions - General
    q1: 'Qu\'est-ce que Vybzzz ?',
    a1: 'Vybzzz est une plateforme de streaming de concerts en direct qui permet aux artistes de diffuser leurs performances et aux fans de regarder des concerts exclusifs depuis n\'importe où dans le monde.',

    q2: 'Comment fonctionne Vybzzz ?',
    a2: 'Les artistes créent leurs concerts sur la plateforme, les fans achètent des billets pour y accéder. Les concerts peuvent être regardés en direct ou en replay pendant 7 jours.',

    q3: 'Vybzzz est-il disponible dans mon pays ?',
    a3: 'Vybzzz est disponible dans le monde entier. Cependant, certains événements peuvent avoir des restrictions géographiques définies par les artistes.',

    // Questions - Account
    q4: 'Comment créer un compte ?',
    a4: 'Téléchargez l\'application, appuyez sur "Inscription" et remplissez le formulaire avec votre email, mot de passe et nom. Vous pouvez également vous connecter avec votre compte Google ou Apple.',

    q5: 'Comment modifier mon profil ?',
    a5: 'Allez dans Profil > Modifier le profil. Vous pouvez changer votre photo, nom, bio et autres informations.',

    q6: 'Comment supprimer mon compte ?',
    a6: 'Allez dans Paramètres > Compte > Supprimer le compte. Cette action est irréversible et supprimera toutes vos données.',

    // Questions - Payments
    q7: 'Quels moyens de paiement acceptez-vous ?',
    a7: 'Nous acceptons les cartes Visa, Mastercard, American Express, et Apple Pay/Google Pay via Stripe.',

    q8: 'Mon paiement est-il sécurisé ?',
    a8: 'Oui, tous les paiements sont traités par Stripe avec un chiffrement SSL. Nous ne stockons jamais vos données de carte.',

    q9: 'Comment obtenir un remboursement ?',
    a9: 'Les remboursements sont possibles jusqu\'à 24h avant le concert. Contactez le support avec votre numéro de billet.',

    // Questions - Streaming
    q10: 'Quelle qualité de streaming est disponible ?',
    a10: 'La qualité dépend de votre connexion : SD (480p), HD (720p), Full HD (1080p) et 4K UHD pour les abonnés Premium.',

    q11: 'Puis-je regarder un concert en replay ?',
    a11: 'Oui, tous les concerts sont disponibles en replay pendant 7 jours après la diffusion en direct.',

    q12: 'Que faire si le stream ne fonctionne pas ?',
    a12: 'Vérifiez votre connexion internet, redémarrez l\'application, ou essayez de réduire la qualité vidéo. Si le problème persiste, contactez le support.',

    // Questions - Tickets
    q13: 'Comment acheter un billet ?',
    a13: 'Trouvez un concert, appuyez sur "Acheter un billet", choisissez votre type de billet et procédez au paiement.',

    q14: 'Où trouver mes billets ?',
    a14: 'Vos billets sont dans l\'onglet "Billets" de l\'application. Vous recevez également une confirmation par email.',

    q15: 'Puis-je transférer mon billet ?',
    a15: 'Non, les billets sont nominatifs et ne peuvent pas être transférés pour des raisons de sécurité.',

    // Questions - Artists
    q16: 'Comment devenir artiste sur Vybzzz ?',
    a16: 'Allez dans Profil > Devenir artiste et choisissez votre plan (Smart, Pro ou Premium). Après vérification, vous pourrez créer des concerts.',

    q17: 'Quels sont les plans disponibles pour les artistes ?',
    a17: 'Smart (39€/mois, 50% revenus), Pro (79€/mois, 60% revenus), Premium (99€/mois, 70% revenus). Chaque plan offre différentes fonctionnalités.',

    q18: 'Comment suis-je payé ?',
    a18: 'Les revenus sont versés sur votre compte Stripe Connect tous les 15 jours. Le minimum de retrait est de 50€.',

    // Contact
    stillNeedHelp: 'Vous avez encore des questions ?',
    contactSupport: 'Contactez notre support',
  },

  // Errors
  error: {
    generic: 'Une erreur est survenue',
    network: 'Erreur de connexion',
    server: 'Erreur serveur',
    notFound: 'Non trouvé',
    unauthorized: 'Non autorisé',
    forbidden: 'Accès refusé',
    timeout: 'Délai d\'attente dépassé',
    offline: 'Vous êtes hors ligne',
    tryAgain: 'Veuillez réessayer',
    contactSupport: 'Si le problème persiste, contactez le support',
  },

  // Empty states
  empty: {
    noConcerts: 'Aucun concert disponible',
    noResults: 'Aucun résultat',
    noNotifications: 'Aucune notification',
    noFavorites: 'Aucun favori',
    noFollowing: 'Vous ne suivez personne',
    noFollowers: 'Aucun abonné',
  },

  // Time
  time: {
    now: 'Maintenant',
    justNow: 'À l\'instant',
    minutesAgo: 'Il y a {{count}} minute(s)',
    hoursAgo: 'Il y a {{count}} heure(s)',
    daysAgo: 'Il y a {{count}} jour(s)',
    weeksAgo: 'Il y a {{count}} semaine(s)',
    monthsAgo: 'Il y a {{count}} mois',
    yearsAgo: 'Il y a {{count}} an(s)',
    inMinutes: 'Dans {{count}} minute(s)',
    inHours: 'Dans {{count}} heure(s)',
    inDays: 'Dans {{count}} jour(s)',
  },
};
