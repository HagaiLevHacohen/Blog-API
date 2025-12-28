const { prisma } = require("../lib/prisma");

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      passwordHashed: "hashedpassword1",
      admin: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      passwordHashed: "hashedpassword2",
      admin: false,
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: "First Post",
      content: "This is the first post",
      published: true,
      userId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Second Post",
      content: "This is another post",
      published: false,
      userId: user2.id,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: "Great post!",
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Thanks!",
      userId: user1.id,
      postId: post1.id,
    },
  });

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
