PGDMP}excellence_healthcare16.316.3��00ENCODINGENCODINGSET client_encoding = 'UTF8';
false�00
STDSTRINGS
STDSTRINGS(SET standard_conforming_strings = 'on';
false�00
SEARCHPATH
SEARCHPATH8SELECT pg_catalog.set_config('search_path', '', false);
false�126225179excellence_healthcareDATABASE�CREATE DATABASE excellence_healthcare WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'French_France.1252';
%DROP DATABASE excellence_healthcare;
postgresfalse�125930331bulk_order_itemsTABLEECREATE TABLE public.bulk_order_items (
    id bigint NOT NULL,
    bulk_order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
$DROP TABLE public.bulk_order_items;
publicheappostgresfalse�125930330bulk_order_items_id_seqSEQUENCE�CREATE SEQUENCE public.bulk_order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
.DROP SEQUENCE public.bulk_order_items_id_seq;
publicpostgresfalse243�00bulk_order_items_id_seqSEQUENCE OWNED BYSALTER SEQUENCE public.bulk_order_items_id_seq OWNED BY public.bulk_order_items.id;
publicpostgresfalse242�125930312bulk_ordersTABLE�CREATE TABLE public.bulk_orders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(255) NOT NULL,
    customer_address text NOT NULL,
    notes text,
    payment_method character varying(255) DEFAULT 'cash'::character varying NOT NULL,
    delivery_method character varying(255) DEFAULT 'amana'::character varying NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT bulk_orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);
DROP TABLE public.bulk_orders;
publicheappostgresfalse�125930311bulk_orders_id_seqSEQUENCE{CREATE SEQUENCE public.bulk_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
)DROP SEQUENCE public.bulk_orders_id_seq;
publicpostgresfalse241�00bulk_orders_id_seqSEQUENCE OWNED BYIALTER SEQUENCE public.bulk_orders_id_seq OWNED BY public.bulk_orders.id;
publicpostgresfalse240�125930153cacheTABLE�CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);
DROP TABLE public.cache;
publicheappostgresfalse�125930160cache_locksTABLE�CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);
DROP TABLE public.cache_locks;
publicheappostgresfalse�125930235
cart_itemsTABLE�CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
DROP TABLE public.cart_items;
publicheappostgresfalse�125930234cart_items_id_seqSEQUENCEzCREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
(DROP SEQUENCE public.cart_items_id_seq;
publicpostgresfalse233�00cart_items_id_seqSEQUENCE OWNED BYGALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;
publicpostgresfalse232�125930197
categoriesTABLE$CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    icon character varying(255),
    description text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
DROP TABLE public.categories;
publicheappostgresfalse�125930196categories_id_seqSEQUENCEzCREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
(DROP SEQUENCE public.categories_id_seq;
publicpostgresfalse229�00categories_id_seqSEQUENCE OWNED BYGALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
publicpostgresfalse228�125930348clientsTABLE�CREATE TABLE public.clients (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    address text NOT NULL,
    city character varying(255) NOT NULL,
    total_orders integer DEFAULT 0 NOT NULL,
    total_spent numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    last_order_date date,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT clients_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'vip'::character varying])::text[])))
);
DROP TABLE public.clients;
publicheappostgresfalse�125930347clients_id_seqSEQUENCEwCREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
%DROP SEQUENCE public.clients_id_seq;
publicpostgresfalse245�00clients_id_seqSEQUENCE OWNED BYAALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;
publicpostgresfalse244�125930185failed_jobsTABLE&CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
DROP TABLE public.failed_jobs;
publicheappostgresfalse�125930184failed_jobs_id_seqSEQUENCE{CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
)DROP SEQUENCE public.failed_jobs_id_seq;
publicpostgresfalse227�00failed_jobs_id_seqSEQUENCE OWNED BYIALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;
publicpostgresfalse226�125930255	favoritesTABLE�CREATE TABLE public.favorites (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    product_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
DROP TABLE public.favorites;
publicheappostgresfalse�125930254favorites_id_seqSEQUENCEyCREATE SEQUENCE public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
'DROP SEQUENCE public.favorites_id_seq;
publicpostgresfalse235�00favorites_id_seqSEQUENCE OWNED BYEALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;
publicpostgresfalse234�125930177job_batchesTABLEdCREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);
DROP TABLE public.job_batches;
publicheappostgresfalse�125930168jobsTABLE�CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);
DROP TABLE public.jobs;
publicheappostgresfalse�125930167jobs_id_seqSEQUENCEtCREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
"DROP SEQUENCE public.jobs_id_seq;
publicpostgresfalse224�00jobs_id_seqSEQUENCE OWNED BY;ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
publicpostgresfalse223�125930118
migrationsTABLE�CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
DROP TABLE public.migrations;
publicheappostgresfalse�125930117migrations_id_seqSEQUENCE�CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
(DROP SEQUENCE public.migrations_id_seq;
publicpostgresfalse216�00migrations_id_seqSEQUENCE OWNED BYGALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
publicpostgresfalse215�125930366
notificationsTABLE�CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    icon character varying(255),
    action_label character varying(255),
    action_type character varying(255),
    action_data json,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['order'::character varying, 'promotion'::character varying, 'product'::character varying, 'info'::character varying])::text[])))
);
!DROP TABLE public.notifications;
publicheappostgresfalse�125930365notifications_id_seqSEQUENCE}CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
+DROP SEQUENCE public.notifications_id_seq;
publicpostgresfalse247�00notifications_id_seqSEQUENCE OWNED BYMALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
publicpostgresfalse246�125930295order_itemsTABLE;CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
DROP TABLE public.order_items;
publicheappostgresfalse�125930294order_items_id_seqSEQUENCE{CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
)DROP SEQUENCE public.order_items_id_seq;
publicpostgresfalse239�00order_items_id_seqSEQUENCE OWNED BYIALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
publicpostgresfalse238�125930274ordersTABLE�CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_number character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    address text NOT NULL,
    city character varying(255) NOT NULL,
    postal_code character varying(255),
    notes text,
    shipping_method character varying(255) DEFAULT 'amana'::character varying NOT NULL,
    payment_method character varying(255) DEFAULT 'cash'::character varying NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);
DROP TABLE public.orders;
publicheappostgresfalse�125930273
orders_id_seqSEQUENCEvCREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
$DROP SEQUENCE public.orders_id_seq;
publicpostgresfalse237�00
orders_id_seqSEQUENCE OWNED BY?ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
publicpostgresfalse236�125930137password_reset_tokensTABLE�CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);
)DROP TABLE public.password_reset_tokens;
publicheappostgresfalse�125930382personal_access_tokensTABLE�CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
*DROP TABLE public.personal_access_tokens;
publicheappostgresfalse�125930381personal_access_tokens_id_seqSEQUENCE�CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
4DROP SEQUENCE public.personal_access_tokens_id_seq;
publicpostgresfalse249�00personal_access_tokens_id_seqSEQUENCE OWNED BY_ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;
publicpostgresfalse248�125930208productsTABLElCREATE TABLE public.products (
    id bigint NOT NULL,
    reference character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    prix_detail numeric(10,2) NOT NULL,
    prix_gros numeric(10,2) NOT NULL,
    image_principale character varying(255),
    images_secondaires json,
    category_id bigint NOT NULL,
    brand character varying(255),
    stock integer DEFAULT 0 NOT NULL,
    seuil_alerte integer DEFAULT 10 NOT NULL,
    in_stock boolean GENERATED ALWAYS AS ((stock > 0)) STORED NOT NULL,
    rating numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    reviews_count integer DEFAULT 0 NOT NULL,
    tags json,
    actif boolean DEFAULT true NOT NULL,
    promotion boolean DEFAULT false NOT NULL,
    pourcentage_promo numeric(5,2),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
DROP TABLE public.products;
publicheappostgresfalse�125930207products_id_seqSEQUENCExCREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
&DROP SEQUENCE public.products_id_seq;
publicpostgresfalse231�00products_id_seqSEQUENCE OWNED BYCALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
publicpostgresfalse230�125930144sessionsTABLE�CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);
DROP TABLE public.sessions;
publicheappostgresfalse�125930395	shipmentsTABLE�CREATE TABLE public.shipments (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    user_id bigint NOT NULL,
    recipient_name character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    address text NOT NULL,
    city character varying(255) NOT NULL,
    postal_code character varying(255),
    fee_regular numeric(8,2) NOT NULL,
    fee_b2b numeric(8,2) NOT NULL,
    free_from_regular numeric(8,2),
    free_from_b2b numeric(8,2),
    applied_fee numeric(8,2) DEFAULT '0'::numeric NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    tracking_number character varying(255),
    carrier character varying(255),
    shipped_at timestamp(0) without time zone,
    delivered_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT shipments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'preparing'::character varying, 'ready'::character varying, 'shipped'::character varying, 'in_transit'::character varying, 'delivered'::character varying, 'failed'::character varying, 'cancelled'::character varying])::text[])))
);
DROP TABLE public.shipments;
publicheappostgresfalse�125930394shipments_id_seqSEQUENCEyCREATE SEQUENCE public.shipments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
'DROP SEQUENCE public.shipments_id_seq;
publicpostgresfalse251�00shipments_id_seqSEQUENCE OWNED BYEALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;
publicpostgresfalse250�125930125usersTABLE/CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    type character varying(255) DEFAULT 'b2c'::character varying NOT NULL,
    phone character varying(255),
    address text,
    city character varying(255),
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    company_name character varying(255),
    tax_id character varying(255),
    license_number character varying(255),
    CONSTRAINT users_type_check CHECK (((type)::text = ANY ((ARRAY['b2c'::character varying, 'b2b'::character varying, 'admin'::character varying])::text[])))
);
DROP TABLE public.users;
publicheappostgresfalse�125930124users_id_seqSEQUENCEuCREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
#DROP SEQUENCE public.users_id_seq;
publicpostgresfalse218�00users_id_seqSEQUENCE OWNED BY=ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
publicpostgresfalse217�260430334bulk_order_items idDEFAULTzALTER TABLE ONLY public.bulk_order_items ALTER COLUMN id SET DEFAULT nextval('public.bulk_order_items_id_seq'::regclass);
BALTER TABLE public.bulk_order_items ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse243242243�260430315bulk_orders idDEFAULTpALTER TABLE ONLY public.bulk_orders ALTER COLUMN id SET DEFAULT nextval('public.bulk_orders_id_seq'::regclass);
=ALTER TABLE public.bulk_orders ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse240241241�260430238
cart_items idDEFAULTnALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);
<ALTER TABLE public.cart_items ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse233232233�260430200
categories idDEFAULTnALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
<ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse229228229�260430351
clients idDEFAULThALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);
9ALTER TABLE public.clients ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse245244245�260430188failed_jobs idDEFAULTpALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);
=ALTER TABLE public.failed_jobs ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse227226227�260430258favorites idDEFAULTlALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);
;ALTER TABLE public.favorites ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse234235235�260430171jobs idDEFAULTbALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
6ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse223224224�260430121
migrations idDEFAULTnALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
<ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse216215216�260430369notifications idDEFAULTtALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
?ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse246247247�260430298order_items idDEFAULTpALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);
=ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse239238239�260430277	orders idDEFAULTfALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
8ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse236237237�260430385personal_access_tokens idDEFAULT�ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);
HALTER TABLE public.personal_access_tokens ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse248249249�260430211products idDEFAULTjALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
:ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse230231231�260430398shipments idDEFAULTlALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);
;ALTER TABLE public.shipments ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse251250251�260430128users idDEFAULTdALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
7ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
publicpostgresfalse217218218�030331bulk_order_items
TABLE DATApublicpostgresfalse243���030312bulk_orders
TABLE DATApublicpostgresfalse241��030153cache
TABLE DATApublicpostgresfalse221��030160cache_locks
TABLE DATApublicpostgresfalse2226��030235
cart_items
TABLE DATApublicpostgresfalse233P��030197
categories
TABLE DATApublicpostgresfalse229��030348clients
TABLE DATApublicpostgresfalse245���030185failed_jobs
TABLE DATApublicpostgresfalse227���030255	favorites
TABLE DATApublicpostgresfalse235��030177job_batches
TABLE DATApublicpostgresfalse225���030168jobs
TABLE DATApublicpostgresfalse224���030118
migrations
TABLE DATApublicpostgresfalse216���030366
notifications
TABLE DATApublicpostgresfalse247��030295order_items
TABLE DATApublicpostgresfalse239���030274orders
TABLE DATApublicpostgresfalse237Y��030137password_reset_tokens
TABLE DATApublicpostgresfalse219'��030382personal_access_tokens
TABLE DATApublicpostgresfalse249A��030208products
TABLE DATApublicpostgresfalse2313��030144sessions
TABLE DATApublicpostgresfalse220���030395	shipments
TABLE DATApublicpostgresfalse251���030125users
TABLE DATApublicpostgresfalse218���00bulk_order_items_id_seqSEQUENCE SETFSELECT pg_catalog.setval('public.bulk_order_items_id_seq', 1, false);
publicpostgresfalse242�00bulk_orders_id_seqSEQUENCE SETASELECT pg_catalog.setval('public.bulk_orders_id_seq', 1, false);
publicpostgresfalse240�00cart_items_id_seqSEQUENCE SET?SELECT pg_catalog.setval('public.cart_items_id_seq', 7, true);
publicpostgresfalse232�00categories_id_seqSEQUENCE SET?SELECT pg_catalog.setval('public.categories_id_seq', 9, true);
publicpostgresfalse228�00clients_id_seqSEQUENCE SET=SELECT pg_catalog.setval('public.clients_id_seq', 1, false);
publicpostgresfalse244�00failed_jobs_id_seqSEQUENCE SETASELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);
publicpostgresfalse226�00favorites_id_seqSEQUENCE SET>SELECT pg_catalog.setval('public.favorites_id_seq', 8, true);
publicpostgresfalse234�00jobs_id_seqSEQUENCE SET:SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);
publicpostgresfalse223�00migrations_id_seqSEQUENCE SET@SELECT pg_catalog.setval('public.migrations_id_seq', 17, true);
publicpostgresfalse215�00notifications_id_seqSEQUENCE SETBSELECT pg_catalog.setval('public.notifications_id_seq', 2, true);
publicpostgresfalse246�00order_items_id_seqSEQUENCE SET@SELECT pg_catalog.setval('public.order_items_id_seq', 3, true);
publicpostgresfalse238�00
orders_id_seqSEQUENCE SET;SELECT pg_catalog.setval('public.orders_id_seq', 1, true);
publicpostgresfalse236�00personal_access_tokens_id_seqSEQUENCE SETKSELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 6, true);
publicpostgresfalse248�00products_id_seqSEQUENCE SET=SELECT pg_catalog.setval('public.products_id_seq', 9, true);
publicpostgresfalse230�00shipments_id_seqSEQUENCE SET?SELECT pg_catalog.setval('public.shipments_id_seq', 1, false);
publicpostgresfalse250�00users_id_seqSEQUENCE SET:SELECT pg_catalog.setval('public.users_id_seq', 3, true);
publicpostgresfalse217�260630336&bulk_order_items bulk_order_items_pkey
CONSTRAINTdALTER TABLE ONLY public.bulk_order_items
    ADD CONSTRAINT bulk_order_items_pkey PRIMARY KEY (id);
PALTER TABLE ONLY public.bulk_order_items DROP CONSTRAINT bulk_order_items_pkey;
publicpostgresfalse243�260630324bulk_orders bulk_orders_pkey
CONSTRAINTZALTER TABLE ONLY public.bulk_orders
    ADD CONSTRAINT bulk_orders_pkey PRIMARY KEY (id);
FALTER TABLE ONLY public.bulk_orders DROP CONSTRAINT bulk_orders_pkey;
publicpostgresfalse241�260630166cache_locks cache_locks_pkey
CONSTRAINT[ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);
FALTER TABLE ONLY public.cache_locks DROP CONSTRAINT cache_locks_pkey;
publicpostgresfalse222�260630159cache cache_pkey
CONSTRAINTOALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);
:ALTER TABLE ONLY public.cache DROP CONSTRAINT cache_pkey;
publicpostgresfalse221�260630241cart_items cart_items_pkey
CONSTRAINTXALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
DALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_pkey;
publicpostgresfalse233�260630253/cart_items cart_items_user_id_product_id_unique
CONSTRAINTyALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_unique UNIQUE (user_id, product_id);
YALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_user_id_product_id_unique;
publicpostgresfalse233233�260630204categories categories_pkey
CONSTRAINTXALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
DALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
publicpostgresfalse229�260630206!categories categories_slug_unique
CONSTRAINT\ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
KALTER TABLE ONLY public.categories DROP CONSTRAINT categories_slug_unique;
publicpostgresfalse229260630359clients clients_pkey
CONSTRAINTRALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
>ALTER TABLE ONLY public.clients DROP CONSTRAINT clients_pkey;
publicpostgresfalse245�260630193failed_jobs failed_jobs_pkey
CONSTRAINTZALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
FALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_pkey;
publicpostgresfalse227�260630195#failed_jobs failed_jobs_uuid_unique
CONSTRAINT^ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);
MALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_uuid_unique;
publicpostgresfalse227�260630260favorites favorites_pkey
CONSTRAINTVALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
BALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
publicpostgresfalse235�260630272-favorites favorites_user_id_product_id_unique
CONSTRAINTwALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_product_id_unique UNIQUE (user_id, product_id);
WALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_user_id_product_id_unique;
publicpostgresfalse235235�260630183job_batches job_batches_pkey
CONSTRAINTZALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);
FALTER TABLE ONLY public.job_batches DROP CONSTRAINT job_batches_pkey;
publicpostgresfalse225�260630175jobs jobs_pkey
CONSTRAINTLALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
8ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
publicpostgresfalse224�260630123migrations migrations_pkey
CONSTRAINTXALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
DALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
publicpostgresfalse216260630375 notifications notifications_pkey
CONSTRAINT^ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
JALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
publicpostgresfalse247�260630300order_items order_items_pkey
CONSTRAINTZALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
FALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
publicpostgresfalse239�260630293!orders orders_order_number_unique
CONSTRAINTdALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
KALTER TABLE ONLY public.orders DROP CONSTRAINT orders_order_number_unique;
publicpostgresfalse237�260630286orders orders_pkey
CONSTRAINTPALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
<ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
publicpostgresfalse237�2606301430password_reset_tokens password_reset_tokens_pkey
CONSTRAINTqALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);
ZALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
publicpostgresfalse2192606303892personal_access_tokens personal_access_tokens_pkey
CONSTRAINTpALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);
\ALTER TABLE ONLY public.personal_access_tokens DROP CONSTRAINT personal_access_tokens_pkey;
publicpostgresfalse249260630392:personal_access_tokens personal_access_tokens_token_unique
CONSTRAINTvALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);
dALTER TABLE ONLY public.personal_access_tokens DROP CONSTRAINT personal_access_tokens_token_unique;
publicpostgresfalse249�260630222products products_pkey
CONSTRAINTTALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
@ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
publicpostgresfalse231�260630233"products products_reference_unique
CONSTRAINTbALTER TABLE ONLY public.products
    ADD CONSTRAINT products_reference_unique UNIQUE (reference);
LALTER TABLE ONLY public.products DROP CONSTRAINT products_reference_unique;
publicpostgresfalse231�260630150sessions sessions_pkey
CONSTRAINTTALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
@ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
publicpostgresfalse220
260630417#shipments shipments_order_id_unique
CONSTRAINTbALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_unique UNIQUE (order_id);
MALTER TABLE ONLY public.shipments DROP CONSTRAINT shipments_order_id_unique;
publicpostgresfalse251260630405shipments shipments_pkey
CONSTRAINTVALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);
BALTER TABLE ONLY public.shipments DROP CONSTRAINT shipments_pkey;
publicpostgresfalse251�260630136users users_email_unique
CONSTRAINTTALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
BALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
publicpostgresfalse218�260630134users users_pkey
CONSTRAINTNALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
:ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
publicpostgresfalse218�125930176jobs_queue_indexINDEXBCREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
$DROP INDEX public.jobs_queue_index;
publicpostgresfalse224125930393'personal_access_tokens_expires_at_indexINDEXpCREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);
;DROP INDEX public.personal_access_tokens_expires_at_index;
publicpostgresfalse2491259303908personal_access_tokens_tokenable_type_tokenable_id_indexINDEX�CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);
LDROP INDEX public.personal_access_tokens_tokenable_type_tokenable_id_index;
publicpostgresfalse249249�125930229products_actif_indexINDEXJCREATE INDEX products_actif_index ON public.products USING btree (actif);
(DROP INDEX public.products_actif_index;
publicpostgresfalse231�125930228products_category_id_indexINDEXVCREATE INDEX products_category_id_index ON public.products USING btree (category_id);
.DROP INDEX public.products_category_id_index;
publicpostgresfalse231�125930230products_in_stock_indexINDEXPCREATE INDEX products_in_stock_index ON public.products USING btree (in_stock);
+DROP INDEX public.products_in_stock_index;
publicpostgresfalse231�125930231(products_name_description_brand_fulltextINDEX�CREATE INDEX products_name_description_brand_fulltext ON public.products USING gin ((((to_tsvector('english'::regconfig, (name)::text) || to_tsvector('english'::regconfig, description)) || to_tsvector('english'::regconfig, (brand)::text))));
<DROP INDEX public.products_name_description_brand_fulltext;
publicpostgresfalse231231231231�125930152sessions_last_activity_indexINDEXZCREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);
0DROP INDEX public.sessions_last_activity_index;
publicpostgresfalse220�125930151sessions_user_id_indexINDEXNCREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);
*DROP INDEX public.sessions_user_id_index;
publicpostgresfalse2202606303377bulk_order_items bulk_order_items_bulk_order_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.bulk_order_items
    ADD CONSTRAINT bulk_order_items_bulk_order_id_foreign FOREIGN KEY (bulk_order_id) REFERENCES public.bulk_orders(id) ON DELETE CASCADE;
aALTER TABLE ONLY public.bulk_order_items DROP CONSTRAINT bulk_order_items_bulk_order_id_foreign;
publicpostgresfalse24148602432606303424bulk_order_items bulk_order_items_product_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.bulk_order_items
    ADD CONSTRAINT bulk_order_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
^ALTER TABLE ONLY public.bulk_order_items DROP CONSTRAINT bulk_order_items_product_id_foreign;
publicpostgresfalse2314842243260630325'bulk_orders bulk_orders_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.bulk_orders
    ADD CONSTRAINT bulk_orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
QALTER TABLE ONLY public.bulk_orders DROP CONSTRAINT bulk_orders_user_id_foreign;
publicpostgresfalse2182414813260630247(cart_items cart_items_product_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
RALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_product_id_foreign;
publicpostgresfalse2332314842260630242%cart_items cart_items_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
OALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_user_id_foreign;
publicpostgresfalse4813233218260630360clients clients_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
IALTER TABLE ONLY public.clients DROP CONSTRAINT clients_user_id_foreign;
publicpostgresfalse2182454813260630266&favorites favorites_product_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
PALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_product_id_foreign;
publicpostgresfalse2314842235260630261#favorites favorites_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
MALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_user_id_foreign;
publicpostgresfalse2184813235260630376+notifications notifications_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
UALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_foreign;
publicpostgresfalse2474813218260630301(order_items order_items_order_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
RALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_foreign;
publicpostgresfalse2392374856260630306*order_items order_items_product_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
TALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_foreign;
publicpostgresfalse2314842239260630287orders orders_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
GALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_foreign;
publicpostgresfalse4813237218
260630223%products products_category_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
OALTER TABLE ONLY public.products DROP CONSTRAINT products_category_id_foreign;
publicpostgresfalse2292314834260630406$shipments shipments_order_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
NALTER TABLE ONLY public.shipments DROP CONSTRAINT shipments_order_id_foreign;
publicpostgresfalse2512374856260630411#shipments shipments_user_id_foreign
FK CONSTRAINT�ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
MALTER TABLE ONLY public.shipments DROP CONSTRAINT shipments_user_id_foreign;
publicpostgresfalse2512184813�
x��� �
x��� �
x��� �
x��� ��x����
�@�O174�qw�������v��BA����A��²���3EY������u��ݦ;=��.�'w��+XQ�c`e�����^�4��L��CJ��(Y�/���������;\��K���; 4 �L%Om`���D�`�����|o�OȘI�O��8����x����N�@��y��A�8�ݤ|�
ME$�U�g׃���k��5ϑcfqz�D�"�|�ƿ�gf7���V,nn�.�F�����u���vu7_��|,VV��*< ߳�=��P�p�?�X���ECF�!�h��|�ey��"��Ng�y����C|Ŏ��'��{@�Ԡ��Lg)[�����N7
���(��:�u�jkH[��y:Ou��U�Rv0�)���q�2��p Ð�> A&�_Ζ���ܬ�'0�tw(�8�JY���]I4��w�`m���k��i��I�Q(QH��CA~MS�lY�;3��jUЖh��`�<b�4r;{�ȡV�95�i;���ڐ\^@�M/�`\�i�#/W����o�[?l[r��6��T�`2��vB.i���|����^?m􎥇%���d4z�����
x��� �
x��� �ox���v
Q���W((M��L�KK,�/�,I-Vs�	u
V�0�Q0�Q��FF�����F
�&V&�V���8�5��<�1�l�	m7nJ�������p��$���o|�
x��� �
x��� �Nx���=o�0�=��-�U>�N2 U�Ԥ]-cq��_�-$��+b����^��~�z���%膼V�Q��V�ޟ�߶��V�����~�0�[Ɇ^��Y��r�
��q��	�3(����(h8����9��ș�И0H���K�VV�(��c_��Q�.a1n�@�K��2ee��׾�&���M¢F����#�M�۱�Wir��'ķ�p��>�����6�x:s�4nQ+٢Bߍ��k�U�?�`t?�ԅ��i�J%�¹�K��@��RB©�Ρ��5�B��|�I���Χ�GJ�>T�+yn����
#������Qu�w���Uuܙ��x���M�0���b\�	��֕Q,�߾�!6����;y/f�ĸp���˼7��QV@L����r����3j��mRF9����Rը|+v�먨P���`�Q��P��Qh�)�f�eu>Y���y_�,)���lh��s��x�����F:�#*ơ��0>�(�R3�9h����S�^�z����_�iI�gx���v
Q���W((M��L��/JI-��,I�-Vs�	u
V�0�Q�#KK=8���!5��<�3�l��������#3s��3gq�9�<�b��>U��x�u���0�<�ު	����{� jA�Ki�������&�|��l��$���I���X�����T����/),��!�^��e"O��R�����m,���Ʀ�e�m�� ��k����V%䶞�`�b'q�������H$�+XG>�.���F>C/�1MW�[Ny�1��
�`�[����;�q�L,B��
x��� ��x���=O1��_��!����i{SQP "H"d{�
��������]�����xv�������tqu�eZ������_6�O������������]ޞ_O��t:9[��>?�?n�n7�rr:�8-����?a��<���4S�Q���Q�
4�1Q�%6�+��
! �������(+��	x��5�����R\�y��������*&�Ғs�l0h�ܪG��K(�P����6�E��f���mHy�� 0�鮒�r373
�1)�"�G��G�ƪ�RcPmԣ�;����"K�nocg�A`�cO�
{ˑ��ʱt!n�<����̥K�-#�b����[�4o���4�,�����s�y��wM�C
��;E�qƘ���o&�1[�:.�a�#Z�L<���q�TsX�[�̎��Il(��r�2�������v*�A;�H)P�1���.0�L^@��,����Pq|��mx�͖�r�0���{G;b ��`'NlB�I�K�l@�O#�Lx��G^���dڴ�3�rᱴ#�J��]ə��<g�@V~�X��x�,�"�����|�@�К[vgd_�̮,��1rz�0�/�1���yN�a�E�neS��IW��%BF9�֔�4d��1fe���:�*J�_�,/RNWxV��l�b�2
�_���0]�����a2�D"��en�e�K���6<�(���RU��Q�@�sM?'j���O'��Ԋ�{�:u���R���;�4�[�9�	��I�
�9�S�h���F?qr��jG��W1��c{t폥����Y�h	�Z�u$�d\��)J
h��6d���7��~��r��
R�`^�ﵝ�&e(���O�_�8KS��VP�R��E,y�G}�-L����Wx��ܞ[�'�ye^`D�#p�F Л���=�~4ڏ��f�bc<8�1r�;+��	&�쑳�/j���Ҭ��u�]�?
:f]}>�*=�]��B�b�Ks�g����H�D�f��Q�gY��?�~E���6����]�J|
��`.6,Z�ES�� ��}X��(�3���{�ֈeKwS�A<L�g��v�i������ʿ�$���Π.o�����;Z���
x��� �
x��� �zx���]o�0����0aK&Ja��/C��`U
���?��%�m�nڜ����ꖣNg@�fc�Ͻ��|�b��Eל�x���P���(±��"Ce��׌�Z���4��*<UX�;����7f
c_�Ԡ�����H1T��f+[6�<��8_^�W�����j�P�
Ķ(��}���R���A���c����u�"���0�V� v�m�C4Y�}�7R{�������&I�Q�F��ֶ�q	��_n����Ԓ���w������n�C�����纳����F|D[MǞ��<E_��zvy��Tg�UL$��FR�����U�q�o���079���8���g��2Z�C����k