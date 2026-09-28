const courses = [
  { title: 'Introducción a lógica', category: 'Fundamentos', level: 'Inicial', duration: '4 semanas', art: 'orange-art', symbol: '∴', description: 'Desarrolla pensamiento estructurado para resolver problemas.' },
  { title: 'Clases de HTML', category: 'Tecnología', level: 'Inicial', duration: '5 semanas', art: 'blue-art', symbol: '</>', description: 'Construye tus primeras páginas web desde cero.' },
  { title: 'Seguridad digital', category: 'Tecnología', level: 'Intermedio', duration: '3 semanas', art: 'green-art', symbol: '◇', description: 'Protege tu información y navega con mejores hábitos.' },
  { title: 'Introducción a la IA', category: 'Tecnología', level: 'Inicial', duration: '4 semanas', art: 'violet-art', symbol: '✦', description: 'Conoce las bases de la inteligencia artificial y sus usos.' }
];

const pageNames = { inicio: 'Inicio', nosotros: 'Nosotros', servicios: 'Servicios', galeria: 'Galería', contacto: 'Contacto', estadisticas: 'Estadísticas' };
const pageViews = document.querySelectorAll('.page-view');
const sidebar = document.querySelector('#sidebar');
const toast = document.querySelector('#toast');
document.querySelector('.contact-detail strong').textContent = 'robertocarlosquispenunez23@gmail.com';

function showPage(page) {
  const target = pageNames[page] ? page : 'inicio';
  document.querySelectorAll('.page-view').forEach(view => view.classList.toggle('active', view.id === `page-${target}`));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === target));
  document.querySelector('#pageTitle').textContent = pageNames[target];
  window.history.replaceState(null, '', `#${target}`);
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-page]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showPage(link.dataset.page);
}));
document.querySelector('#menuToggle').addEventListener('click', () => sidebar.classList.toggle('open'));

function enableSubtleMotion() {
  const visual = document.querySelector('.hero-visual');
  if (visual && window.matchMedia('(pointer:fine)').matches) {
    visual.addEventListener('pointermove', event => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      visual.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
    });
    visual.addEventListener('pointerleave', () => { visual.style.transform = ''; });
  }
  document.querySelectorAll('.primary-button,.outline-button,.play-button,.enroll-button,.download-button').forEach(button => button.addEventListener('click', () => {
    button.classList.remove('clicked');
    requestAnimationFrame(() => button.classList.add('clicked'));
  }));
}

function renderCourses(filter = 'Todos', search = '') {
  const grid = document.querySelector('#courseGrid');
  const normalizedSearch = search.toLowerCase().trim();
  const filtered = courses.filter(course => (filter === 'Todos' || course.category === filter) && course.title.toLowerCase().includes(normalizedSearch));
  grid.innerHTML = filtered.length ? filtered.map(course => `
    <article class="course-card"><div class="course-art ${course.art}"><strong>${course.symbol}</strong></div>
    <span class="course-meta">${course.category} · ${course.level}</span><h3>${course.title}</h3><p>${course.description}</p>
    <div class="course-bottom"><small>${course.duration}</small><button class="enroll-button" data-course="${course.title}">Ver curso ↗</button></div></article>`).join('') : '<p class="empty-state">No encontramos cursos con ese criterio.</p>';
  grid.querySelectorAll('.enroll-button').forEach(button => button.addEventListener('click', () => openCourseModal(button.dataset.course)));
  grid.querySelectorAll('.course-card').forEach((card, index) => { card.classList.add('reveal'); setTimeout(() => card.classList.add('visible'), index * 70); });
}

document.querySelectorAll('.filter-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.filter-tab').forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  renderCourses(tab.dataset.filter, document.querySelector('#courseSearch').value);
}));
document.querySelector('#courseSearch').addEventListener('input', event => renderCourses(document.querySelector('.filter-tab.active').dataset.filter, event.target.value));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function openCourseModal(title) {
  const course = courses.find(item => item.title === title);
  if (!course) return;
  document.querySelector('.course-modal')?.remove();
  const modal = document.createElement('div');
  modal.className = 'course-modal open';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', `Detalles de ${course.title}`);
  modal.innerHTML = `<div class="modal-card"><button class="modal-close" aria-label="Cerrar">×</button><span class="eyebrow">RUTA DE APRENDIZAJE</span><h2>${course.title}</h2><p>${course.description} En esta ruta tendrás actividades prácticas, acompañamiento y recursos para convertir lo aprendido en un proyecto.</p><div class="modal-meta"><span>${course.category}</span><span>${course.level}</span><span>${course.duration}</span></div><button class="primary-button modal-action">Reservar mi cupo <span>→</span></button></div>`;
  document.body.append(modal);
  document.body.style.overflow = 'hidden';
  const close = () => { modal.classList.remove('open'); setTimeout(() => modal.remove(), 250); };
  const closeAndRestore = () => { close(); document.body.style.overflow = ''; };
  modal.addEventListener('click', event => { if (event.target === modal || event.target.closest('.modal-close')) closeAndRestore(); });
  modal.querySelector('.modal-action').addEventListener('click', () => { closeAndRestore(); showToast(`Tu interés en ${course.title} fue registrado.`); });
  modal.querySelector('.modal-close').focus();
}

function enableGalleryLightbox() {
  document.querySelectorAll('.gallery-item img').forEach(image => image.addEventListener('click', () => {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox open';
    lightbox.innerHTML = `<button class="modal-close" aria-label="Cerrar">×</button><img src="${image.src}" alt="${image.alt}">`;
    document.body.append(lightbox);
    const close = () => { lightbox.classList.remove('open'); setTimeout(() => lightbox.remove(), 250); };
    lightbox.addEventListener('click', event => { if (event.target === lightbox || event.target.closest('.modal-close')) close(); });
  }));
}

function enableRevealAnimations() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.feature-card,.section-heading,.stat-card,.schedule-day,.resource-item,.student-item,.gallery-item').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${Math.min(index * 45, 300)}ms`;
    observer.observe(element);
  });
}

document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.querySelectorAll('.course-modal,.lightbox').forEach(element => element.remove()); document.body.style.overflow = ''; } });
document.querySelector('#addSchedule').addEventListener('click', () => showToast('Recordatorio agregado a tu agenda.'));
const resources = [
  ['PDF', 'Introducción a lógica', 'Guía de estudio · PDF', 'introduccion-a-logica.txt', 'Aula Nova - Introducción a lógica\n\nConceptos básicos de razonamiento, proposiciones y resolución de problemas.'],
  ['HTML', 'Clases de HTML', 'Apuntes y etiquetas · TXT', 'clases-de-html.txt', 'Aula Nova - Clases de HTML\n\nEstructura base, etiquetas semánticas, enlaces, imágenes y formularios.'],
  ['SEC', 'Seguridad digital', 'Lista de comprobación · TXT', 'seguridad-digital.txt', 'Aula Nova - Seguridad digital\n\nUsa contraseñas únicas, activa doble autenticación y verifica los enlaces antes de abrirlos.'],
  ['IA', 'Introducción a la IA', 'Glosario inicial · TXT', 'introduccion-a-la-ia.txt', 'Aula Nova - Introducción a la IA\n\nDatos, modelos, entrenamiento, prompts y usos responsables de la inteligencia artificial.']
];
const studentSection = document.createElement('div');
studentSection.className = 'students-section';
studentSection.innerHTML = '<div class="section-heading"><div><span class="eyebrow">COMUNIDAD DE AULA NOVA</span><h2>Estudiantes <em>actuales.</em></h2></div><span class="resource-count">Documento oficial</span></div><div class="student-item"><span class="student-avatar">DOC</span><div><strong>Lista_de_estudiantes</strong><small>Documento Word · Lista actual de estudiantes</small></div><a class="download-button" href="Lista_de_estudiantes.docx" download aria-label="Descargar Lista_de_estudiantes">↓</a></div>';
document.querySelector('#page-servicios').append(studentSection);

const gallerySection = document.createElement('section');
gallerySection.className = 'page-view';
gallerySection.id = 'page-galeria';
gallerySection.innerHTML = '<div class="page-intro"><span class="eyebrow">RECURSOS DE LA CARRERA</span><h1>Aprende con<br><em>referencias reales.</em></h1><p>Imágenes y videos para inspirarte en programación, desarrollo web, seguridad digital e inteligencia artificial.</p></div><div class="gallery-grid"><figure class="gallery-item large"><img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85" alt="Código de programación en pantalla"><figcaption><span>01 / PROGRAMACIÓN</span><strong>Construye desde la lógica</strong></figcaption></figure><figure class="gallery-item"><img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=85" alt="Seguridad digital y protección de datos"><figcaption><span>02 / SEGURIDAD DIGITAL</span><strong>Protege lo que creas</strong></figcaption></figure><figure class="gallery-item"><img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=85" alt="Inteligencia artificial representada en una pantalla"><figcaption><span>03 / INTELIGENCIA ARTIFICIAL</span><strong>Explora nuevas posibilidades</strong></figcaption></figure><figure class="gallery-item wide video-frame"><iframe src="https://www.youtube.com/embed/zOjov-2OZ0E" title="Introducción a la programación" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><figcaption><span>04 / VIDEO EDUCATIVO</span><strong>Primeros pasos para programar</strong></figcaption></figure></div>';
document.querySelector('.main-content').insertBefore(gallerySection, document.querySelector('#page-estadisticas'));
gallerySection.querySelector('iframe').style.cssText = 'width:100%;height:100%;border:0';

const resourceSection = document.createElement('div');
resourceSection.className = 'resources-section';
resourceSection.innerHTML = '<div class="section-heading"><div><span class="eyebrow">BIBLIOTECA ABIERTA</span><h2>Recursos para <em>crear.</em></h2></div><span class="resource-count">4 materiales disponibles</span></div><div class="resource-grid">' + resources.map((resource, index) => `<article class="resource-item"><span class="resource-type resource-${index}">${resource[0]}</span><div><strong>${resource[1]}</strong><small>${resource[2]}</small></div><button class="download-button" data-resource="${index}" aria-label="Descargar ${resource[1]}">↓</button></article>`).join('') + '</div>';
document.querySelector('#page-servicios').append(resourceSection);
resourceSection.querySelectorAll('.download-button').forEach(button => button.addEventListener('click', () => {
  const resource = resources[button.dataset.resource];
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([resource[4]], { type: 'text/plain;charset=utf-8' }));
  link.download = resource[3];
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Recurso descargado.');
}));

const form = document.querySelector('#contactForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const error = field.parentElement.querySelector('.error-message');
    let message = '';
    if (!field.value.trim()) message = 'Este campo es obligatorio.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = 'Ingresa un correo válido.';
    error.textContent = message;
    field.style.borderColor = message ? '#d7533a' : '#559b77';
    if (message) valid = false;
  });
  if (valid) { document.querySelector('#formSuccess').style.display = 'block'; form.reset(); showToast('Mensaje enviado correctamente.'); }
});

document.querySelectorAll('#rating button').forEach(button => button.addEventListener('click', () => {
  const score = Number(button.dataset.rating);
  document.querySelectorAll('#rating button').forEach(item => item.classList.toggle('selected', Number(item.dataset.rating) <= score));
  document.querySelector('#ratingLabel').textContent = `${score}/5 · Gracias por tu opinión`;
  showToast('Tu valoración fue registrada.');
}));

renderCourses();
enableGalleryLightbox();
enableRevealAnimations();
enableSubtleMotion();
const initialPage = window.location.hash.replace('#', '');
if (pageNames[initialPage]) showPage(initialPage);
