--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

-- Started on 2022-12-22 00:16:25 CET

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

--
-- TOC entry 3589 (class 1262 OID 22478)
-- Name: realtime-document-db; Type: DATABASE; Schema: -; Owner: postgres
--

ALTER DATABASE "realtime-document-db" OWNER TO postgres;

\connect "realtime-document-db"

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
-- TOC entry 211 (class 1259 OID 22494)
-- Name: collaborator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collaborator (
    user_id character varying NOT NULL,
    document_id bigint NOT NULL
);


ALTER TABLE public.collaborator OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 22480)
-- Name: document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document (
    id bigint NOT NULL,
    title character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    owner character varying NOT NULL,
    modified timestamp with time zone,
    content character varying NOT NULL
);


ALTER TABLE public.document OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 22479)
-- Name: document_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.document ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.document_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3583 (class 0 OID 22494)
-- Dependencies: 211
-- Data for Name: collaborator; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3582 (class 0 OID 22480)
-- Dependencies: 210
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 209
-- Name: document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_id_seq', 26, true);


--
-- TOC entry 3440 (class 2606 OID 22500)
-- Name: collaborator collaborator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collaborator
    ADD CONSTRAINT collaborator_pkey PRIMARY KEY (user_id, document_id);


--
-- TOC entry 3438 (class 2606 OID 22486)
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- TOC entry 3441 (class 2606 OID 22501)
-- Name: collaborator document_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collaborator
    ADD CONSTRAINT document_id FOREIGN KEY (document_id) REFERENCES public.document(id);


-- Completed on 2022-12-22 00:16:25 CET

--
-- PostgreSQL database dump complete
--

