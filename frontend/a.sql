create table public.fichas_sociales (
  id uuid not null default extensions.uuid_generate_v4 (),
  apellidos character varying(255) not null,
  nombres character varying(255) not null,
  sexo character(1) null,
  nacionalidad character varying(100) null,
  fecha_nacimiento date not null,
  dni character varying(8) null,
  carne_extranjeria character varying(20) null,
  nivel_educativo character varying(100) null,
  estado_civil public.estado_civil null,
  num_hijos integer null default 0,
  domicilio_actual text null,
  distrito character varying(100) null,
  datos_vivienda jsonb null default '{"material": [], "tenencia": [], "servicios": [], "ubicacion": [], "problemas_sociales": []}'::jsonb,
  datos_salud jsonb null default '{"alergias": {}, "enfermedades": {}, "medicamentos": [], "grupo_sanguineo": null}'::jsonb,
  datos_economicos jsonb null default '{"egresos": {"deudas_seguros": {}, "gastos_familiares": {}, "servicios_basicos": {}}, "ingresos": {"otros": 0, "conyuge": 0, "trabajador": 0}}'::jsonb,
  declaracion_jurada jsonb null default '{"fecha_firma": null, "firma_digital": null, "acepta_terminos": false, "nombre_firmante": null}'::jsonb,
  estado public.estado_ficha null default 'incompleta'::estado_ficha,
  porcentaje_completado integer null default 0,
  created_by uuid null,
  updated_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint fichas_sociales_pkey primary key (id),
  constraint fichas_sociales_created_by_fkey foreign KEY (created_by) references usuarios (id),
  constraint fichas_sociales_updated_by_fkey foreign KEY (updated_by) references usuarios (id),
  constraint fichas_sociales_porcentaje_completado_check check (
    (
      (porcentaje_completado >= 0)
      and (porcentaje_completado <= 100)
    )
  ),
  constraint fichas_sociales_sexo_check check ((sexo = any (array['M'::bpchar, 'F'::bpchar])))
) TABLESPACE pg_default;

create index IF not exists idx_fichas_apellidos on public.fichas_sociales using btree (apellidos) TABLESPACE pg_default;

create index IF not exists idx_fichas_nombres on public.fichas_sociales using btree (nombres) TABLESPACE pg_default;

create index IF not exists idx_fichas_dni on public.fichas_sociales using btree (dni) TABLESPACE pg_default;

create index IF not exists idx_fichas_estado on public.fichas_sociales using btree (estado) TABLESPACE pg_default;

create index IF not exists idx_fichas_distrito on public.fichas_sociales using btree (distrito) TABLESPACE pg_default;

create index IF not exists idx_fichas_created_at on public.fichas_sociales using btree (created_at) TABLESPACE pg_default;

create index IF not exists idx_fichas_busqueda on public.fichas_sociales using gin (
  to_tsvector(
    'spanish'::regconfig,
    (
      ((apellidos)::text || ' '::text) || (nombres)::text
    )
  )
) TABLESPACE pg_default;

create trigger trigger_auditoria_fichas
after INSERT
or DELETE
or
update on fichas_sociales for EACH row
execute FUNCTION registrar_auditoria ();

create trigger trigger_fichas_updated_at BEFORE
update on fichas_sociales for EACH row
execute FUNCTION actualizar_updated_at ();



-- log 
create table public.fichas_sociales (
  id uuid not null default extensions.uuid_generate_v4 (),
  apellidos character varying(255) not null,
  nombres character varying(255) not null,
  sexo character(1) null,
  nacionalidad character varying(100) null,
  fecha_nacimiento date not null,
  dni character varying(8) null,
  carne_extranjeria character varying(20) null,
  nivel_educativo character varying(100) null,
  estado_civil public.estado_civil null,
  num_hijos integer null default 0,
  domicilio_actual text null,
  distrito character varying(100) null,
  datos_vivienda jsonb null default '{"material": [], "tenencia": [], "servicios": [], "ubicacion": [], "problemas_sociales": []}'::jsonb,
  datos_salud jsonb null default '{"alergias": {}, "enfermedades": {}, "medicamentos": [], "grupo_sanguineo": null}'::jsonb,
  datos_economicos jsonb null default '{"egresos": {"deudas_seguros": {}, "gastos_familiares": {}, "servicios_basicos": {}}, "ingresos": {"otros": 0, "conyuge": 0, "trabajador": 0}}'::jsonb,
  declaracion_jurada jsonb null default '{"fecha_firma": null, "firma_digital": null, "acepta_terminos": false, "nombre_firmante": null}'::jsonb,
  estado public.estado_ficha null default 'incompleta'::estado_ficha,
  porcentaje_completado integer null default 0,
  created_by uuid null,
  updated_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint fichas_sociales_pkey primary key (id),
  constraint fichas_sociales_created_by_fkey foreign KEY (created_by) references usuarios (id),
  constraint fichas_sociales_updated_by_fkey foreign KEY (updated_by) references usuarios (id),
  constraint fichas_sociales_porcentaje_completado_check check (
    (
      (porcentaje_completado >= 0)
      and (porcentaje_completado <= 100)
    )
  ),
  constraint fichas_sociales_sexo_check check ((sexo = any (array['M'::bpchar, 'F'::bpchar])))
) TABLESPACE pg_default;

create index IF not exists idx_fichas_apellidos on public.fichas_sociales using btree (apellidos) TABLESPACE pg_default;

create index IF not exists idx_fichas_nombres on public.fichas_sociales using btree (nombres) TABLESPACE pg_default;

create index IF not exists idx_fichas_dni on public.fichas_sociales using btree (dni) TABLESPACE pg_default;

create index IF not exists idx_fichas_estado on public.fichas_sociales using btree (estado) TABLESPACE pg_default;

create index IF not exists idx_fichas_distrito on public.fichas_sociales using btree (distrito) TABLESPACE pg_default;

create index IF not exists idx_fichas_created_at on public.fichas_sociales using btree (created_at) TABLESPACE pg_default;

create index IF not exists idx_fichas_busqueda on public.fichas_sociales using gin (
  to_tsvector(
    'spanish'::regconfig,
    (
      ((apellidos)::text || ' '::text) || (nombres)::text
    )
  )
) TABLESPACE pg_default;

create trigger trigger_auditoria_fichas
after INSERT
or DELETE
or
update on fichas_sociales for EACH row
execute FUNCTION registrar_auditoria ();

create trigger trigger_fichas_updated_at BEFORE
update on fichas_sociales for EACH row
execute FUNCTION actualizar_updated_at ();

-- entrevistas aplicadas
create table public.entrevistas_aplicadas (
  id uuid not null default extensions.uuid_generate_v4 (),
  ficha_social_id uuid null,
  estudiante_nombres character varying(255) not null,
  estudiante_apellidos character varying(255) not null,
  estudiante_edad integer null,
  estudiante_fecha_nacimiento date null,
  aula character varying(50) null,
  grado character varying(50) null,
  respuestas jsonb null default '{"pregunta_1": "", "pregunta_3": "", "pregunta_4": "", "pregunta_5": "", "pregunta_6": "", "pregunta_7": "", "pregunta_8": "", "pregunta_9": "", "pregunta_10": "", "pregunta_2_opcion": "", "pregunta_2_porque": ""}'::jsonb,
  estado public.estado_ficha null default 'incompleta'::estado_ficha,
  porcentaje_completado integer null default 0,
  created_by uuid null,
  updated_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint entrevistas_aplicadas_pkey primary key (id),
  constraint entrevistas_aplicadas_created_by_fkey foreign KEY (created_by) references usuarios (id),
  constraint entrevistas_aplicadas_ficha_social_id_fkey foreign KEY (ficha_social_id) references fichas_sociales (id) on delete set null,
  constraint entrevistas_aplicadas_updated_by_fkey foreign KEY (updated_by) references usuarios (id),
  constraint entrevistas_aplicadas_estudiante_edad_check check ((estudiante_edad > 0)),
  constraint entrevistas_aplicadas_porcentaje_completado_check check (
    (
      (porcentaje_completado >= 0)
      and (porcentaje_completado <= 100)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_entrevistas_estudiante on public.entrevistas_aplicadas using btree (estudiante_apellidos, estudiante_nombres) TABLESPACE pg_default;

create index IF not exists idx_entrevistas_ficha on public.entrevistas_aplicadas using btree (ficha_social_id) TABLESPACE pg_default;

create index IF not exists idx_entrevistas_estado on public.entrevistas_aplicadas using btree (estado) TABLESPACE pg_default;

create index IF not exists idx_entrevistas_grado on public.entrevistas_aplicadas using btree (grado) TABLESPACE pg_default;

create index IF not exists idx_entrevistas_created_at on public.entrevistas_aplicadas using btree (created_at) TABLESPACE pg_default;

create trigger trigger_auditoria_entrevistas
after INSERT
or DELETE
or
update on entrevistas_aplicadas for EACH row
execute FUNCTION registrar_auditoria ();

create trigger trigger_entrevistas_updated_at BEFORE
update on entrevistas_aplicadas for EACH row
execute FUNCTION actualizar_updated_at ();


-- modulos 
create table public.modulos (
  id uuid not null default extensions.uuid_generate_v4 (),
  nombre character varying(100) not null,
  codigo character varying(50) not null,
  descripcion text null,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint modulos_pkey primary key (id),
  constraint modulos_codigo_key unique (codigo),
  constraint modulos_nombre_key unique (nombre)
) TABLESPACE pg_default;

create index IF not exists idx_modulos_codigo on public.modulos using btree (codigo) TABLESPACE pg_default;

-- permisos 
create table public.modulos (
  id uuid not null default extensions.uuid_generate_v4 (),
  nombre character varying(100) not null,
  codigo character varying(50) not null,
  descripcion text null,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint modulos_pkey primary key (id),
  constraint modulos_codigo_key unique (codigo),
  constraint modulos_nombre_key unique (nombre)
) TABLESPACE pg_default;

create index IF not exists idx_modulos_codigo on public.modulos using btree (codigo) TABLESPACE pg_default;

-- roles 
create table public.roles (
  id uuid not null default extensions.uuid_generate_v4 (),
  nombre character varying(100) not null,
  descripcion text null,
  es_sistema boolean null default false,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint roles_pkey primary key (id),
  constraint roles_nombre_key unique (nombre)
) TABLESPACE pg_default;

create index IF not exists idx_roles_nombre on public.roles using btree (nombre) TABLESPACE pg_default;

create index IF not exists idx_roles_activo on public.roles using btree (activo) TABLESPACE pg_default;

create trigger trigger_roles_updated_at BEFORE
update on roles for EACH row
execute FUNCTION actualizar_updated_at ();


-- usuarios 
create table public.roles (
  id uuid not null default extensions.uuid_generate_v4 (),
  nombre character varying(100) not null,
  descripcion text null,
  es_sistema boolean null default false,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint roles_pkey primary key (id),
  constraint roles_nombre_key unique (nombre)
) TABLESPACE pg_default;

create index IF not exists idx_roles_nombre on public.roles using btree (nombre) TABLESPACE pg_default;

create index IF not exists idx_roles_activo on public.roles using btree (activo) TABLESPACE pg_default;

create trigger trigger_roles_updated_at BEFORE
update on roles for EACH row
execute FUNCTION actualizar_updated_at ();


