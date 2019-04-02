--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

-- Started on 2019-03-12 12:07:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- ALTER SYSTEM SET wal_level = logical;

--
-- TOC entry 2825 (class 1262 OID 16521)
-- Name: pbkk; Type: DATABASE; Schema: -; Owner: pbkk
--

-- CREATE DATABASE pbkk WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16535)
-- Name: logs; Type: TABLE; Schema: public; Owner: pbkk
--

CREATE TABLE public.logs (
    text text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    synced boolean DEFAULT false
);


ALTER TABLE public.logs OWNER TO pbkk;

--
-- TOC entry 196 (class 1259 OID 16522)
-- Name: users; Type: TABLE; Schema: public; Owner: pbkk
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(512),
    password character varying(512)
);


ALTER TABLE public.users OWNER TO pbkk;

--
-- TOC entry 197 (class 1259 OID 16528)
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
-- TOC entry 2826 (class 0 OID 0)
-- Dependencies: 197
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pbkk
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2691 (class 2604 OID 16530)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2695 (class 2606 OID 16532)
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- TOC entry 2697 (class 2606 OID 16534)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pbkk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2819 (class 6100 OID 16543)
-- Name: pbkk_client; Type: SUBSCRIPTION; Schema: -; Owner: pbkk
--

CREATE SUBSCRIPTION pbkk_client CONNECTION 'user=pbkk password=nuzulcarrykita host=rsmbyk.com port=15432 dbname=pbkk' PUBLICATION pbkk_master;


ALTER SUBSCRIPTION pbkk_client OWNER TO pbkk;

-- Completed on 2019-03-12 12:07:54

--
-- PostgreSQL database dump complete
--

