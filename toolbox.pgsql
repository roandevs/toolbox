--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Debian 13.5-0+deb11u1)
-- Dumped by pg_dump version 13.5 (Debian 13.5-0+deb11u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    notes text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: TABLE projects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.projects IS 'Collection of projects';


--
-- Name: COLUMN projects.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.projects.id IS 'Unique project ID';


--
-- Name: COLUMN projects.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.projects.name IS 'Name of the project';


--
-- Name: COLUMN projects.notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.projects.notes IS 'Notes for the project';


--
-- Name: COLUMN projects.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.projects.created_at IS 'Timestamp of when the project was created';


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminders (
    id integer NOT NULL,
    description text NOT NULL,
    date_set timestamp without time zone NOT NULL,
    date_due timestamp without time zone NOT NULL,
    reminded boolean NOT NULL
);


ALTER TABLE public.reminders OWNER TO postgres;

--
-- Name: TABLE reminders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.reminders IS 'Collection of reminders';


--
-- Name: COLUMN reminders.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminders.id IS 'Unique reminder ID';


--
-- Name: COLUMN reminders.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminders.description IS 'Description of the reminder';


--
-- Name: COLUMN reminders.date_set; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminders.date_set IS 'The date the reminder was set';


--
-- Name: COLUMN reminders.date_due; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminders.date_due IS 'The date the reminder is due';


--
-- Name: COLUMN reminders.reminded; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminders.reminded IS 'Has the user been reminded?';


--
-- Name: reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reminders_id_seq OWNER TO postgres;

--
-- Name: reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reminders_id_seq OWNED BY public.reminders.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.todos OWNER TO postgres;

--
-- Name: TABLE todos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.todos IS 'Collection of todos';


--
-- Name: COLUMN todos.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.todos.id IS 'Unique todo ID';


--
-- Name: COLUMN todos.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.todos.description IS 'Description of the todo';


--
-- Name: COLUMN todos.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.todos.created_at IS 'Timestamp of when the todo was created';


--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_id_seq OWNER TO postgres;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: reminders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders ALTER COLUMN id SET DEFAULT nextval('public.reminders_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, notes, created_at) FROM stdin;
10	0b6d36e5d68599	106c79fbd187884e20b4ddc8e153c1df2f96c2fb2fbb96eb0289382ece00f2e0754f6936	2021-06-13 16:02:33.220895
5	2c7236e6dac49157	557c79fbd18680542dbec1daa153c4d96bc1ceeb2eefdbea0790347ec400b3f16e497e601f53659df889cc5ff38f9621dda4a43484f3f89b79c6a9599f7d1f45aeca021fcb83f1cf39fe8db55a82d096c4ef47cf1c1792caf75711215ffb6b84630fce122a700862a876da37e1c4b2c11fa9179ef9c1be2ba8690f6b96d6efb935f14ef72151448b01e367034b471636596fd5065a082d9b535c269e43768ba8e83738f340bc1f825dd7b91700cb6a8a0cacac25f5d318ad5dc6cecfea89964596de6d626baa592041f7623eb9fdb4ad5db22d7a2df3ad6bcd03629740f9f845c9da68d83d3bccb7ebb24b0d922949845207adb947a23881c1fbbe01a6490efe10b9738a94a3f747bf56d83f28a658863f16685a77066d2e16a50fb189577fc8ace4f7640b927a3936edc22b756e1e4ea85c42bf2801f5abdf0dea774237bf7a722ded39d2771ba8ac0fdf48bae58015b6154d6a5e20fc4b172e7bdf85084075c9843e619157e7b62df091b32557385805d2e8d3d5131c6b895c27a771412b716f9f6631c353fa39a8824398edd4d5f6c4eedf627565e8302cb8b53940adf11fa43e9e1d9bd87c4e1361ead0bd40e6665ba040faceb05a0422b2c3b557014d2b4adb2e07453acf3381159d9015cb93af359be81b9b9964cb8060edfd7d3e0aecb25e6b453064198272e827a18707aacd2d88664d2b9508f68e579451415100297a077952faa0728f67bf90030ec3441409a3a6770d42d9d8472dab174b9e3d8f205960bd9d4aa76ee45f45ed6894c83f4dc0674a42ea066b185089222c4d2462ea0f4055641762143350aa3502d26b34193741fc494bfcdcd2279af1a998d64c1a7931e9336eecc6f6b78eb04defe3e6a8c0f2ecbb71d76d4c86ff6a13ddc45e03282c880ae5f8fead92f1b465e88083c6478cb7c468e8	2021-06-01 02:01:26.734819
14	326d2fe0d1ca924930b4	326332ec949e8e5236b4c1cf9212d0d26bd2c2f323bbd3bf06813061da1cb3f76f53786c1454659ae4db8149ea8f96399aaded758eb0eb8663c6b83af1305b4fefd7084f8490a19c23fe8bbd5b94dcd0cdf20bce0b17ddd0e508730b53f464c1300cc40238780e29bc779537f29dd6fa3ecc6ff1b2c7b665b4650e6b8cdcaaae70f057ff36055b8a0aea670a48471a784a20960d5b4a688b42452c82026380eca33c32f701ab03935090fd141d89258000b6be75b48d1bbe0989c29acee1b065a08a696d6baa442e48b5726ef6e7b3bc46f42e1c46fda92c8854788e41bcf745d895739d792c89b1ebe1520d972b49815c09a7ba0ae528f884d1bb00a00003ff57bc74dc82a9f05ab950d46c35e3449b29107a167847736611aa1cf4c8583b8babe9ed6448d4332630a2c328263a1044b30e50f93c04f5f885458f0a4f1dc6196021b56bd26317a8aa0cd444f5f48c11aa5247243d1edd4b112e39d294040126db8d247a9a57b5d243a39bb03314220d14cfe89ed21250749f3148c41549627663cb607ed553be2fa2985093acd4c7ebcfeedf663e6ee93962b0f06940a4f04ce93d8d078dd330034378a886de3efd665ebd4bf1c9e05f0c29e690b559005b2b4adc6b45566ad3728b1e859359d09aae609bfc139bdd69d9d321a0f277321cecb8557612337f13d77e8a4cabd444a3c53b9f320b338e44eacb50854b415115332e1a2a44add90c996ff382090e8b055c14afad33114a8bc34d29ee520397358b745f77aae125b42af21a42ed7d9dde6c58c5640442af07781e56936d23314f65e91a4b5f781b351d224aef3c1dd1253b19384bb9434cfcd7d32cdfb0b195970b1d7f7ef1306ef090e8b6daba44f2a5e0bdc0f1e8b67d9b3434e3e6381998db47022f608c44f5b0ecadd3e2ac29e4989e884d9babc875a6a93b72d1a9161d035b996346db4c0fa2f635c1f68a82cbccaa8cd12a069eb11d5325fca73169f491eda9a8115dee9db51d3d5729316bc17bc7b2b106725de4764ff17047d76258756b2bf2c7f0eda9a0b93e49dedf605995d59b175a68f9bbdcad695e7f8803c0acbeeb1b3bbc6996e5d3696b9dac21be09b8e3433b380abe61e8410ae85f81bf69589c65c5cb5238dfe6340df10d55580976caf06cabd59bd3bfa1e70adefba6144023fe46f215612a70d3a9717cb773ea5dc3e30e83b17b7d1e048ec346bb660a3aee32ece7e87dbfaa5a892a36aa197dfac452b69985da4f0204c6267b36a03ac8af75fd26c23612195e05e9dbe934936b3ef335c8d3ebce243c44736d79544c52f6dc3ef429edb65368a3255d3a5391216b063d19f6e622fe94cacf	2021-07-08 15:01:42.433937
15	126737fdd586c16821b0c3cfa55ce3d32ac287cf2aaec2f9049630	2b6a30fa949a8d4130b7c0c9a053d7d227da87f727b9d3bf0ac43e62c100fde0204964680e002c88b7988341f78c8134dfadf1348ae0fe9a2cdbb24589325a4fe387124cc197a29c2ef091f44b8890c3ccf44ad91009cb82f7401d2149fd6ed0750dc4126b740225aa23c12be59dd6f9308269b4b0c6bc2bb8605a3f90d6f3fd71ed4fee64524d8c1ba42e1207401b734320971b1540688e57592f98027686edfa7239ec4fbb4c925f81b8551a9340f30dbdba30bb950cad11c0da8adee1b76ea48d2c626afe432e4afe2777a5a9b5a60fe6357f3fb0a123881525ed2f8dfd41d8d03b956f2c89aee4b34b1fde2a0fc94617e2be03e339d2c5a9bf44a3450ee255b13a889ea7e25cb84ed46c3fa65a812205295e7e4a6d6a59aa06fdc8567dc8b1f6a1694ad63f692dedc12b263d1753ae5c1ff97d1ff5b6824c8c5d5e76be616f2dbf6bd67d1afbb109dd0ff3e88f54ac1d0839721eca040d247bd29208453ad78230359519e9ac21b581ff2557271107d3f9c790145d75c85c2bdb1e1f726d73cb6231c65ef130becb4a93b6d4d1e1cfbdc2667d78ef2169f9fa2701befc09a42c8d019cd039424368a9859722f93058f258fcd3a353432ee190aa50174a2b4ed624575f2f817d801f8ed073aea5ae39d5fa1791dd6a9c902ce5fd707109a0b244690a2e605783628359ffce17e69566c661182c9916bacf4f85554b1002346f0d3544acb6679973bf93055acc0b5c09a0e33111558bde4730f75b46dd70d82e0a66ae9f4aa72bf21a45f76d9bc97b5f8c7f0254af0d72084c9d222a5e2b6ef40f56506e5562173e04a73904cf253056380feb4f5eb0dfc562d4f9a499d65f17687ce36367ebdbe3f9dabb47a1e0fabf88fbf7be75d76959c5b2794e98d7440a7a6a8c05f5adffbc80a3b42dea9bcdcb4381e3c066edbf7e67cbaf5e4d0a549d6f08d84d59cd923ccce4cfc3c4c4e6c1d32e07dbe1175275e4aa7470f4d4cfcc9b377fcdbdfc1d2d492b3f02a45bc7e1bb1c790da57454b37744c0200f787d66ff97e1beeab6a53e559bce605b93c78d454d7aacacd1e26f1b3c9e058fffbafc5e6fa76d87aec96f65c9e92eb302ede150333f14fb7bfd051cee0f9dbf754bd53789da4938d9eb3f04b41130264a7ccebe6aa29a86d3ebb6ee0ac0f1e314412ced46ff1c797f64d0aa6062b77dba25a6ce04c6a06c33530298c510bc700a3df327a9e2ad69aab9548a6332a05d2ef48a4aa7d183c901511ccd2c7d36a829c3af75fd2296245f18441fbd8bf43dcb7629f879d0c8b9ce3f7b583b4b1f045356f0cc34f564b7d43c1ca1751b7f518d2e6b063917a4f438e398cf8268da384a7020bbde711b2eac4f89e2976faff5d4ae3bc668ba0889ab1eefb4ed58e2b9b3359703853b98bf056779013b3e5595efcde6be6688ba89e61523f31d7df46009f904ff03d5cf11bd9283693bcb1bf82939a994ea0eacdfecb4b9f76649bc86856c6a6c98cd4edc0369222ab7280507a3f5484f25c5fc1f59257788fa49899e9c3534adbc7ae915f706bbe2d1492a3b5ea522419682290650f9294cb7ae6dc209ae409e00d5ac952d54f55b96bb57e0e73001ba0786f987659624563ede74eac2dd0581e3cb5fae1b8ba409ace6d5da4283a5f6585a076074184de0b1ab5cee279679fc7445168fd005ae5ad7e2656efab549f4626e7bcdfad9068a6559f7b43fc4bae9533ff0b9a6c51bf43f970592edb7998b8e4e96078a7824f73c096705653434f6816e90f7cfe4c1fcba28b91819f00d7679f570e0484a3df5b63268a486cd4710decaddbaf0d45d4f6d73845a87070c01a672d2e8c35961f895e204ccdec303c1616189ff13526c223a30bd2c2cca16482817dfc83a2f6e5f904d0a8ed3c67feedf22311c6a4f69e04b8e960c95d8757bc65a8b93ae4ce11107054e50619a9bffeb58895756033a1574202e6a8c07ea9134efaabed7804b5f1fee57812d08d26627b444b9137fc029b09066e807b994e8ceda20707b1be0e99295a0ef90a9c8f535e7460066d804f0ac089d613c6060053e3c95fe41ff85a8899dc4e76449b1abb253e5848d32b255d6d308d756fd8ba73eb01a0f319840a77193dc2faa66407db7cee4aeda8c7036a7f45bae99add4d57d9c4d35f78fd46fef6ae7756704c430b744f27d54fe51911f14be1caecb4a97c06f01de98363e20a26071206cd2b5784ee7d91f4d94f98c3177fae4ca4b941c6eac9624d2d6bad61b95a258b71e868a50338f96523520883b49741cd5a9db6173de8bd6e976a76adfdb067227fd09fb122b3c4dbc947b6c3e5a21e3cb0086d130c9391c45e56917c629f4e1caf707f35d4cab0ca2b7ac8f913227707c82885abe6fc4b6427707710da105a7224e5d858cdb6511092f8b533cc88f786ce7ac4319238c30f507636afa2a41b87c895ff669a5cdb105edabc338f9a2e01425c931e727f128e3ddcc0b5ec5d002123311dd4e927412a74c039661e1e01d22c0eb452a347d192f6a9696cc4561cf2f8abd60e85cd5fd01d9ecdab2106c4f622b978f9a56df5717ddd5dda980ecede624f1ef7b7e0082c6d1dcb986a4c1039c763b93ff7414823123a44adffe5bed0a9e8525cdb507cfef58e93057e6d9a64c6508dc96428c1a3048c365c94f8c80cf701c544a685e2a13508ccca863fc7f9d2fcb0f17	2021-07-14 16:27:47.267444
17	326d2fe0da8dc1492a	55602cf0949e885337a4cac8c7	2021-09-04 12:22:21.416132
18	376d2cfad1	286b3fe09482944264e2818bed03d79b63c5c6e923efdff14b80387dc311fce42056696c0a413688ef98c5268db58a298aa7bb6796f5e3cd3589	2021-09-04 15:48:28.463114
19	3872	72223bec948b834c21f1dbd4ed05c9de3c96c6f32aefd5ea19963860dc09eab472486267134e22dbf594985fabc09025c9b5a86097e9e0896fc9a9539379420ba0c94711c88ab6d5239bf5f91d8f9dc0c7a05cd80a45d7ccf254166850e12fd07f5bc2082e740662b0659530e88d82ae249c3dfba388b664a539	2021-11-05 16:17:37.573411
\.


--
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminders (id, description, date_set, date_due, reminded) FROM stdin;
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (id, description, created_at) FROM stdin;
\.


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 3639, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 19, true);


--
-- Name: reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reminders_id_seq', 79, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_id_seq', 28, true);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

