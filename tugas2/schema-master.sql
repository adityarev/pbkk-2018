--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 11.2

-- Started on 2019-03-12 13:30:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2926 (class 1262 OID 16413)
-- Name: pbkk; Type: DATABASE; Schema: -; Owner: pbkk
--

CREATE DATABASE pbkk WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE pbkk OWNER TO pbkk;

\connect pbkk

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2927 (class 0 OID 0)
-- Dependencies: 2926
-- Name: pbkk; Type: DATABASE PROPERTIES; Schema: -; Owner: pbkk
--

ALTER DATABASE pbkk SET "TimeZone" TO 'Asia/Jakarta';


\connect pbkk

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16427)
-- Name: logs; Type: TABLE; Schema: public; Owner: pbkk
--

CREATE TABLE public.logs (
    text text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.logs OWNER TO pbkk;

--
-- TOC entry 196 (class 1259 OID 16414)
-- Name: users; Type: TABLE; Schema: public; Owner: pbkk
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(512),
    password character varying(512)
);


ALTER TABLE public.users OWNER TO pbkk;

--
-- TOC entry 197 (class 1259 OID 16420)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: pbkk
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO pbkk;

--
-- TOC entry 2928 (class 0 OID 0)
-- Dependencies: 197
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pbkk
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2792 (class 2604 OID 16422)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2795 (class 2606 OID 16424)
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- TOC entry 2797 (class 2606 OID 16426)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2919 (class 6104 OID 16434)
-- Name: pbkk_master; Type: PUBLICATION; Schema: -; Owner: pbkk
--

CREATE PUBLICATION pbkk_master WITH (publish = 'insert, update, delete');


ALTER PUBLICATION pbkk_master OWNER TO pbkk;

--
-- TOC entry 2920 (class 6106 OID 16435)
-- Name: pbkk_master users; Type: PUBLICATION TABLE; Schema: public; Owner: 
--

ALTER PUBLICATION pbkk_master ADD TABLE ONLY public.users;


-- Completed on 2019-03-12 13:30:11

--
-- PostgreSQL database dump complete
--

