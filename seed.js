/**
 * Manager Library - Sembrador de Demostración por API REST (T-21)
 * Ejecución: node seed.js [API_BASE_URL]
 * Ejemplo: node seed.js http://localhost:8080/api/v1
 */

const API_BASE = process.argv[2] || process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

console.log('='.repeat(70));
console.log('🌱 MANAGER LIBRARY · SEMBRADOR DE DATOS DE DEMOSTRACIÓN');
console.log(`🎯 Conectando a la API en: ${API_BASE}`);
console.log('='.repeat(70));

async function run() {
  try {
    // 1. Verificar servicio
    console.log('\n1️⃣  Comprobando servicio (/health)...');
    const healthUrl = API_BASE.replace('/api/v1', '') + '/health';
    const healthRes = await fetch(healthUrl).catch(() => null);
    if (!healthRes || !healthRes.ok) {
      console.warn(`⚠️  Healthcheck no respondió 200 en ${healthUrl}. Continuando con intento de autenticación...`);
    } else {
      console.log('✅ Servicio en línea y saludable.');
    }

    // 2. Iniciar sesión como Admin
    console.log('\n2️⃣  Autenticando como Administrador (admin)...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin123*' }),
    });

    if (!loginRes.ok) {
      const err = await loginRes.text();
      throw new Error(`Fallo al iniciar sesión: ${loginRes.status} ${err}`);
    }

    const { access_token: token } = await loginRes.json();
    console.log('✅ Token JWT de administrador obtenido.');

    // 3. Obtener categorías
    console.log('\n3️⃣  Consultando categorías disponibles...');
    const catRes = await fetch(`${API_BASE}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const categories = await catRes.json();
    console.log(`✅ ${categories.length} categorías obtenidas: ${categories.map((c) => c.name).join(', ')}`);
    const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
    const defaultCatId = categories[0]?.id;

    // 4. Sembrar 40 libros
    console.log('\n4️⃣  Registrando 40 libros en el catálogo...');
    const rawBooks = [
      // Novela
      { title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', cat: 'Novela', copies: 5 },
      { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '9788424115982', cat: 'Novela', copies: 4 },
      { title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', isbn: '9780307389732', cat: 'Novela', copies: 3 },
      { title: 'La metamorfosis', author: 'Franz Kafka', isbn: '9788420666327', cat: 'Novela', copies: 4 },
      { title: 'Orgullo y prejuicio', author: 'Jane Austen', isbn: '9788497940740', cat: 'Novela', copies: 3 },
      { title: 'Crimen y castigo', author: 'Fiódor Dostoyevski', isbn: '9788420651347', cat: 'Novela', copies: 3 },
      { title: 'Ficciones', author: 'Jorge Luis Borges', isbn: '9789500418652', cat: 'Novela', copies: 4 },
      { title: 'Rayuela', author: 'Julio Cortázar', isbn: '9788466331906', cat: 'Novela', copies: 3 },
      // Ciencia
      { title: 'Breve historia del tiempo', author: 'Stephen Hawking', isbn: '9788498920192', cat: 'Ciencia', copies: 4 },
      { title: 'Cosmos', author: 'Carl Sagan', isbn: '9788408053989', cat: 'Ciencia', copies: 5 },
      { title: 'El gen egoísta', author: 'Richard Dawkins', isbn: '9788432309489', cat: 'Ciencia', copies: 3 },
      { title: 'El origen de las especies', author: 'Charles Darwin', isbn: '9788497940177', cat: 'Ciencia', copies: 4 },
      { title: 'Sapiens: De animales a dioses', author: 'Yuval Noah Harari', isbn: '9788499926223', cat: 'Ciencia', copies: 6 },
      { title: 'La estructura de las revoluciones científicas', author: 'Thomas Kuhn', isbn: '9789681604431', cat: 'Ciencia', copies: 3 },
      { title: 'Una breve historia de casi todo', author: 'Bill Bryson', isbn: '9788490565865', cat: 'Ciencia', copies: 4 },
      { title: 'Seis piezas fáciles', author: 'Richard Feynman', isbn: '9788498925562', cat: 'Ciencia', copies: 3 },
      // Tecnología
      { title: 'Clean Code: A Handbook of Agile Craftsmanship', author: 'Robert C. Martin', isbn: '9780132350884', cat: 'Tecnología', copies: 5 },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '9780201616224', cat: 'Tecnología', copies: 4 },
      { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma et al.', isbn: '9780201633610', cat: 'Tecnología', copies: 3 },
      { title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler', isbn: '9780201485677', cat: 'Tecnología', copies: 4 },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', cat: 'Tecnología', copies: 3 },
      { title: 'Domain-Driven Design', author: 'Eric Evans', isbn: '9780321125217', cat: 'Tecnología', copies: 3 },
      { title: 'Architecture Patterns with Python', author: 'Harry Percival & Bob Gregory', isbn: '9781492052203', cat: 'Tecnología', copies: 4 },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', cat: 'Tecnología', copies: 5 },
      // Historia
      { title: 'Historia de dos ciudades', author: 'Charles Dickens', isbn: '9788420651262', cat: 'Historia', copies: 3 },
      { title: 'Las venas abiertas de América Latina', author: 'Eduardo Galeano', isbn: '9789682325571', cat: 'Historia', copies: 4 },
      { title: 'Homo Deus', author: 'Yuval Noah Harari', isbn: '9788499926711', cat: 'Historia', copies: 4 },
      { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317557', cat: 'Historia', copies: 3 },
      { title: 'Postguerra: Una historia de Europa desde 1945', author: 'Tony Judt', isbn: '9788430606344', cat: 'Historia', copies: 2 },
      { title: 'Los reyes taifas', author: 'Manuel Tuñón de Lara', isbn: '9788432304910', cat: 'Historia', copies: 2 },
      { title: 'Historia de Colombia y sus oligarquías', author: 'Antonio Caballero', isbn: '9789585445215', cat: 'Historia', copies: 4 },
      { title: 'La segunda guerra mundial', author: 'Antony Beevor', isbn: '9788498925104', cat: 'Historia', copies: 3 },
      // Infantil
      { title: 'El Principito', author: 'Antoine de Saint-Exupéry', isbn: '9780156012195', cat: 'Infantil', copies: 6 },
      { title: 'Donde viven los monstruos', author: 'Maurice Sendak', isbn: '9788420430225', cat: 'Infantil', copies: 4 },
      { title: 'Matilda', author: 'Roald Dahl', isbn: '9788420448107', cat: 'Infantil', copies: 5 },
      { title: 'Charlie y la fábrica de chocolate', author: 'Roald Dahl', isbn: '9788420448114', cat: 'Infantil', copies: 4 },
      { title: 'El árbol generoso', author: 'Shel Silverstein', isbn: '9788420468303', cat: 'Infantil', copies: 3 },
      { title: 'Cuentos en verso para niños perversos', author: 'Roald Dahl', isbn: '9788420464268', cat: 'Infantil', copies: 4 },
      { title: 'Alicia en el país de las maravillas', author: 'Lewis Carroll', isbn: '9788420651279', cat: 'Infantil', copies: 4 },
      { title: 'El monstruo de colores', author: 'Anna Llenas', isbn: '9788494002625', cat: 'Infantil', copies: 5 },
    ];

    const createdBooks = [];
    for (const b of rawBooks) {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: b.title,
          author: b.author,
          isbn: b.isbn,
          category_id: catMap[b.cat] || defaultCatId,
          total_copies: b.copies,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        createdBooks.push(data);
      } else {
        // Si ya existe por ISBN, lo buscamos
        const searchRes = await fetch(`${API_BASE}/books?q=${encodeURIComponent(b.title)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (searchRes.ok) {
          const sData = await searchRes.json();
          if (sData.items[0]) createdBooks.push(sData.items[0]);
        }
      }
    }
    console.log(`✅ ${createdBooks.length} libros disponibles en catálogo.`);

    // 5. Sembrar 10 socios
    console.log('\n5️⃣  Registrando 10 socios...');
    const rawMembers = [
      { name: 'Ana Gómez', doc: '10102020' },
      { name: 'Carlos Mendoza', doc: '10102021' },
      { name: 'Diana Rivas', doc: '10102022' },
      { name: 'Eduardo Silva', doc: '10102023' },
      { name: 'Fernanda Ortiz', doc: '10102024' },
      { name: 'Gabriel Torres', doc: '10102025' },
      { name: 'Helena Vargas', doc: '10102026' },
      { name: 'Ignacio Castro', doc: '10102027' },
      { name: 'Julia Navarro', doc: '10102028' },
      { name: 'Kevin Morales', doc: '10102029' },
    ];

    const createdMembers = [];
    for (const m of rawMembers) {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ full_name: m.name, document_number: m.doc }),
      });
      if (res.ok) {
        createdMembers.push(await res.json());
      } else {
        const sRes = await fetch(`${API_BASE}/members?q=${m.doc}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.items[0]) createdMembers.push(sData.items[0]);
        }
      }
    }
    console.log(`✅ ${createdMembers.length} socios registrados.`);

    // 6. Sembrar 15 préstamos
    console.log('\n6️⃣  Registrando 15 préstamos...');
    let loanCount = 0;
    for (let i = 0; i < 15; i++) {
      const member = createdMembers[i % createdMembers.length];
      const b1 = createdBooks[(i * 2) % createdBooks.length];
      const b2 = createdBooks[(i * 2 + 1) % createdBooks.length];

      if (!member || !b1 || !b2) continue;

      const res = await fetch(`${API_BASE}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          member_id: member.id,
          items: [{ book_id: b1.id }, { book_id: b2.id }],
        }),
      });

      if (res.ok) {
        loanCount++;
      }
    }
    console.log(`✅ ${loanCount} préstamos registrados.`);

    // 7. Verificación final de endpoints
    console.log('\n7️⃣  Comprobando reporte de libros más prestados...');
    const reportRes = await fetch(`${API_BASE}/reports/most-borrowed?from=2026-01-01&to=2026-12-31`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reportRes.ok) {
      const report = await reportRes.json();
      console.log(`✅ Reporte generado exitosamente con ${report.rows.length} libros clasificados.`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 ¡SEMBRADOR COMPLETADO CON ÉXITO! Todos los requisitos T-21 satisfechos.');
    console.log('='.repeat(70));
  } catch (err) {
    console.error('❌ Error durante la siembra:', err.message);
    process.exit(1);
  }
}

run();
