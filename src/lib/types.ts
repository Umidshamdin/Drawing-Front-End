export type Id = string;
export interface Category { id: Id; name: string; slug: string; displayOrder: number; }
export interface ArtworkCard { id: Id; title: string; price: number; city: string; artistName: string; saleStatus: string; mainImageUrl: string | null; publishedAt?: string | null; }
export interface ArtworkDetails { id: Id; title: string; description: string | null; price: number; widthCm: number; heightCm: number; city: string; artistName: string; artistId: Id; saleStatus: string; imageUrls: string[]; categories: string[]; }
export interface Slide { id: Id; title: string; subtitle: string | null; imageUrl: string; buttonText: string | null; linkUrl: string | null; }
export interface HomeCategory { category: Category; artworks: ArtworkCard[]; }
export interface HomeData { slides: Slide[]; categories: HomeCategory[]; featuredArtworks: ArtworkCard[]; }
export interface NavbarData { categories: Category[]; }
export interface FooterData { email: string | null; phone: string | null; instagram: string | null; facebook: string | null; links: SitePage[]; }
export interface SitePage { slug: string; title: string; content: string; }
export interface ArtistCard { id: Id; displayName: string; city: string; profileImageUrl: string | null; }
export interface ArtistPublic extends ArtistCard { biography: string | null; artworks: ArtworkCard[]; }
export interface ArtistProfile extends ArtistCard { userId: Id; biography?: string | null; status: number | string; rejectionReason?: string | null; createdAt?: string; reviewedAt?: string | null; }
export interface UserInfo { id: Id; fullName: string; email: string; phoneNumber?: string | null; roles: string[]; }
export interface AuthResponse { accessToken: string; refreshToken?: string; tokenType: string; expiresAt: string; refreshExpiresAt?: string; user: UserInfo; }
export interface Page<T> { items: T[]; page: number; pageSize: number; total: number; }
export interface SearchParams { q?: string; categoryId?: Id; techniqueId?: Id; subjectId?: Id; minPrice?: number; maxPrice?: number; minWidthCm?: number; maxWidthCm?: number; availableOnly?: boolean; sort?: string; page?: number; pageSize?: number; }
export interface OrderItem { artworkId: Id; title: string; unitPrice: number; }
export interface Order { id: Id; buyerUserId: Id; buyerFullName: string; totalAmount: number; status: string; createdAt: string; items: OrderItem[]; }
export interface Delivery { courierName?: string | null; trackingNumber?: string | null; deliveryNotes?: string | null; estimatedDeliveryAt?: string | null; deliveredAt?: string | null; }
export interface OrderHistory { previousStatus?: string | null; newStatus: string; changedAt: string; note?: string | null; }
export interface Tracking { order: Order; delivery?: Delivery | null; history: OrderHistory[]; }
export interface ArtistSale { orderId: Id; artworkId: Id; artworkTitle: string; amount: number; status: string; createdAt: string; }
export interface ArtworkDraft { id: Id; title: string; description?: string | null; price: number; widthCm: number; heightCm: number; city: string; techniqueId?: Id | null; materialId?: Id | null; subjectId?: Id | null; styleId?: Id | null; creationYear?: number | null; isFramed: boolean; locationDetails?: string | null; moderationStatus?: number | string; saleStatus?: number | string; images?: { id: Id; imageUrl?: string | null; storageKey: string; isPrimary: boolean; sortOrder: number; }[]; }
export interface ArtworkForm { title: string; description: string; price: number; widthCm: number; heightCm: number; city: string; locationDetails: string; techniqueId: string | null; materialId: string | null; subjectId: string | null; styleId: string | null; creationYear: number | null; isFramed: boolean; }
export interface ReferenceItem { id: Id; name: string; }
export interface CategoryAdmin extends Category { description?: string | null; isActive: boolean; showOnHome: boolean; }
export interface SlideAdmin { id: Id; title: string; subtitle?: string | null; imageKey: string; buttonText?: string | null; linkUrl?: string | null; sortOrder: number; isActive: boolean; }
export interface PageAdmin { id: Id; slug: string; title: string; content: string; published: boolean; }
export interface UserAdmin { id: Id; fullName: string; email: string; isBlocked: boolean; createdAt: string; }
export interface ContactAdmin { id: Id; fullName: string; email: string; message: string; isRead: boolean; createdAt: string; }
export interface AdminOrder extends Order { buyerEmail?: string; buyerPhone?: string; deliveryAddress?: string; deliveryCity?: string; deliveryFee?: number; delivery?: Delivery | null; }
export interface AdminNote { id: Id; adminUserId: Id; content: string; createdAt: string; }
export interface FailedEmail { id: Id; toEmail: string; subject: string; attempts: number; lastError?: string | null; createdAt: string; }
export interface AdminDashboard { users: number; artistsPending: number; artworksPending: number; artworksLive: number; ordersPending: number; ordersCompleted: number; }
