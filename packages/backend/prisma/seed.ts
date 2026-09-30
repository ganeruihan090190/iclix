import { PrismaClient, Role, FilmType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.rating.deleteMany();
  await prisma.history.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.film.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create genres
  const genreNames = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];
  const genres: Record<string, { id: string; name: string }> = {};

  for (const name of genreNames) {
    const genre = await prisma.genre.create({ data: { name } });
    genres[name] = genre;
  }

  console.log(`✅ Created ${genreNames.length} genres`);

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@iclix.com',
      password: adminPassword,
      role: Role.ADMIN,
      profiles: {
        create: { name: 'Admin', avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=admin' },
      },
    },
    include: { profiles: true },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@iclix.com',
      password: userPassword,
      role: Role.USER,
      profiles: {
        create: { name: 'User', avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=user' },
      },
    },
    include: { profiles: true },
  });

  console.log(`✅ Created 2 users (admin + user) with profiles`);

  // Film data
  const films = [
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      posterUrl: 'https://picsum.photos/seed/darkknight/400/600',
      backdropUrl: 'https://picsum.photos/seed/darkknight-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      releaseYear: 2008,
      duration: 152,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: true,
      genres: ['Action', 'Thriller', 'Drama'],
    },
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      posterUrl: 'https://picsum.photos/seed/inception/400/600',
      backdropUrl: 'https://picsum.photos/seed/inception-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      releaseYear: 2010,
      duration: 148,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Action', 'Sci-Fi', 'Thriller'],
    },
    {
      title: 'Interstellar',
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: 'https://picsum.photos/seed/interstellar/400/600',
      backdropUrl: 'https://picsum.photos/seed/interstellar-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      releaseYear: 2014,
      duration: 169,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Sci-Fi', 'Drama'],
    },
    {
      title: 'The Shawshank Redemption',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      posterUrl: 'https://picsum.photos/seed/shawshank/400/600',
      backdropUrl: 'https://picsum.photos/seed/shawshank-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      releaseYear: 1994,
      duration: 142,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Drama'],
    },
    {
      title: 'Pulp Fiction',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      posterUrl: 'https://picsum.photos/seed/pulpfiction/400/600',
      backdropUrl: 'https://picsum.photos/seed/pulpfiction-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      releaseYear: 1994,
      duration: 154,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Drama', 'Thriller'],
    },
    {
      title: 'The Matrix',
      description: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
      posterUrl: 'https://picsum.photos/seed/matrix/400/600',
      backdropUrl: 'https://picsum.photos/seed/matrix-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      releaseYear: 1999,
      duration: 136,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Action', 'Sci-Fi'],
    },
    {
      title: 'Parasite',
      description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      posterUrl: 'https://picsum.photos/seed/parasite/400/600',
      backdropUrl: 'https://picsum.photos/seed/parasite-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      releaseYear: 2019,
      duration: 132,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Thriller', 'Drama', 'Comedy'],
    },
    {
      title: 'Spirited Away',
      description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
      posterUrl: 'https://picsum.photos/seed/spiritedaway/400/600',
      backdropUrl: 'https://picsum.photos/seed/spiritedaway-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      releaseYear: 2001,
      duration: 125,
      maturityRating: 'PG',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Animation', 'Drama'],
    },
    {
      title: 'Get Out',
      description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
      posterUrl: 'https://picsum.photos/seed/getout/400/600',
      backdropUrl: 'https://picsum.photos/seed/getout-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      releaseYear: 2017,
      duration: 104,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Horror', 'Thriller'],
    },
    {
      title: 'The Notebook',
      description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
      posterUrl: 'https://picsum.photos/seed/notebook/400/600',
      backdropUrl: 'https://picsum.photos/seed/notebook-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      releaseYear: 2004,
      duration: 123,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Romance', 'Drama'],
    },
    {
      title: 'Superbad',
      description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-fueled party goes awry.',
      posterUrl: 'https://picsum.photos/seed/superbad/400/600',
      backdropUrl: 'https://picsum.photos/seed/superbad-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      releaseYear: 2007,
      duration: 113,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Comedy'],
    },
    {
      title: 'Blade Runner 2049',
      description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
      posterUrl: 'https://picsum.photos/seed/bladerunner/400/600',
      backdropUrl: 'https://picsum.photos/seed/bladerunner-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      releaseYear: 2017,
      duration: 164,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Sci-Fi', 'Action', 'Drama'],
    },
    {
      title: 'The Conjuring',
      description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
      posterUrl: 'https://picsum.photos/seed/conjuring/400/600',
      backdropUrl: 'https://picsum.photos/seed/conjuring-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      releaseYear: 2013,
      duration: 112,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Horror', 'Thriller'],
    },
    {
      title: 'Your Name',
      description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
      posterUrl: 'https://picsum.photos/seed/yourname/400/600',
      backdropUrl: 'https://picsum.photos/seed/yourname-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      releaseYear: 2016,
      duration: 106,
      maturityRating: 'PG',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Animation', 'Romance', 'Drama'],
    },
    {
      title: 'John Wick',
      description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
      posterUrl: 'https://picsum.photos/seed/johnwick/400/600',
      backdropUrl: 'https://picsum.photos/seed/johnwick-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      releaseYear: 2014,
      duration: 101,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Action', 'Thriller'],
    },
    {
      title: 'La La Land',
      description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
      posterUrl: 'https://picsum.photos/seed/lalaland/400/600',
      backdropUrl: 'https://picsum.photos/seed/lalaland-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      releaseYear: 2016,
      duration: 128,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Romance', 'Comedy', 'Drama'],
    },
    {
      title: 'Mad Max: Fury Road',
      description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners and a drifter named Max.',
      posterUrl: 'https://picsum.photos/seed/madmax/400/600',
      backdropUrl: 'https://picsum.photos/seed/madmax-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      releaseYear: 2015,
      duration: 120,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Action', 'Sci-Fi'],
    },
    {
      title: 'The Grand Budapest Hotel',
      description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years.',
      posterUrl: 'https://picsum.photos/seed/budapest/400/600',
      backdropUrl: 'https://picsum.photos/seed/budapest-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      releaseYear: 2014,
      duration: 99,
      maturityRating: 'R',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Comedy', 'Drama'],
    },
    {
      title: 'A Quiet Place',
      description: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.',
      posterUrl: 'https://picsum.photos/seed/quietplace/400/600',
      backdropUrl: 'https://picsum.photos/seed/quietplace-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      releaseYear: 2018,
      duration: 90,
      maturityRating: 'PG-13',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Horror', 'Drama', 'Thriller'],
    },
    {
      title: 'Spider-Man: Into the Spider-Verse',
      description: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
      posterUrl: 'https://picsum.photos/seed/spiderverse/400/600',
      backdropUrl: 'https://picsum.photos/seed/spiderverse-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      releaseYear: 2018,
      duration: 117,
      maturityRating: 'PG',
      type: FilmType.MOVIE,
      featured: false,
      genres: ['Animation', 'Action'],
    },
    {
      title: 'Stranger Things',
      description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
      posterUrl: 'https://picsum.photos/seed/strangerthings/400/600',
      backdropUrl: 'https://picsum.photos/seed/strangerthings-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      releaseYear: 2016,
      duration: 51,
      maturityRating: 'TV-14',
      type: FilmType.SERIES,
      featured: false,
      genres: ['Horror', 'Sci-Fi', 'Drama'],
    },
    {
      title: 'Breaking Bad',
      description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
      posterUrl: 'https://picsum.photos/seed/breakingbad/400/600',
      backdropUrl: 'https://picsum.photos/seed/breakingbad-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      releaseYear: 2008,
      duration: 49,
      maturityRating: 'TV-MA',
      type: FilmType.SERIES,
      featured: false,
      genres: ['Drama', 'Thriller'],
    },
    {
      title: 'Attack on Titan',
      description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
      posterUrl: 'https://picsum.photos/seed/aot/400/600',
      backdropUrl: 'https://picsum.photos/seed/aot-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      releaseYear: 2013,
      duration: 24,
      maturityRating: 'TV-MA',
      type: FilmType.SERIES,
      featured: false,
      genres: ['Animation', 'Action', 'Drama'],
    },
    {
      title: 'The Witcher',
      description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
      posterUrl: 'https://picsum.photos/seed/witcher/400/600',
      backdropUrl: 'https://picsum.photos/seed/witcher-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      releaseYear: 2019,
      duration: 60,
      maturityRating: 'TV-MA',
      type: FilmType.SERIES,
      featured: false,
      genres: ['Action', 'Drama', 'Sci-Fi'],
    },
    {
      title: 'Money Heist',
      description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history — stealing 2.4 billion euros from the Royal Mint of Spain.',
      posterUrl: 'https://picsum.photos/seed/moneyheist/400/600',
      backdropUrl: 'https://picsum.photos/seed/moneyheist-bg/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      releaseYear: 2017,
      duration: 70,
      maturityRating: 'TV-MA',
      type: FilmType.SERIES,
      featured: false,
      genres: ['Action', 'Thriller'],
    },
  ];

  for (const filmData of films) {
    const { genres: genreNames, ...rest } = filmData;
    await prisma.film.create({
      data: {
        ...rest,
        genres: {
          connect: genreNames.map((name) => ({ id: genres[name].id })),
        },
      },
    });
  }

  console.log(`✅ Created ${films.length} films`);
  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
