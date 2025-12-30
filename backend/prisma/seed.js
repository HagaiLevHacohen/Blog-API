const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  // Create users
  const users = [
    {
      username: "alice",
      email: "alice@example.com",
      passwordHashed: await bcrypt.hash("123", 10),
      admin: true,
    },
    {
      username: "bob",
      email: "bob@example.com",
      passwordHashed: await bcrypt.hash("456", 10),
      admin: false,
    },
    {
      username: "charlie",
      email: "charlie@example.com",
      passwordHashed: await bcrypt.hash("789", 10),
      admin: false,
    },
    {
      username: "diana",
      email: "diana@example.com",
      passwordHashed: await bcrypt.hash("abc", 10),
      admin: false,
    },
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  // Create posts with longer content
  const postsData = [
    {
      title: "Welcome to Nightlog",
      content: `
Welcome to Nightlog, the place where creativity meets code. This is the first post of our blog, and we are thrilled to have you here. 
Our goal is to share knowledge, experiences, and tips about programming, design, and the tech lifestyle.  

In the coming weeks, we’ll post tutorials, interviews, and behind-the-scenes stories of building projects like this one. 
Whether you are a beginner or an experienced developer, we hope you find value here and join our growing community.
      `,
      published: true,
      userId: createdUsers[0].id,
    },
    {
      title: "React Tips",
      content: `
React is one of the most popular JavaScript libraries for building user interfaces. In this post, we’ll cover some tips that can help you write cleaner, more efficient React code.  

1. **Use functional components and hooks** – they simplify state management and side effects.  
2. **Keep components small and focused** – this improves readability and reusability.  
3. **Memoize expensive calculations** – using useMemo and useCallback wisely can improve performance.  

By following these tips, your React applications will be easier to maintain and scale.
      `,
      published: true,
      userId: createdUsers[1].id,
    },
    {
      title: "Backend Thoughts",
      content: `
Building APIs with Node and Express is both fun and challenging. One thing I’ve learned is that designing your data models upfront is crucial.  

Consider using Prisma for ORM — it provides type safety, query building, and migration tools. Also, authentication and authorization are important to secure your endpoints.  

Finally, always think about the frontend consumers of your API. Good REST design or GraphQL schema can make your frontend development smooth and predictable.
      `,
      published: false,
      userId: createdUsers[0].id,
    },
    {
      title: "Daily Coding",
      content: `
Consistency is key when it comes to improving coding skills. Today, I spent time refactoring some old code, learning about new ES2025 features, and experimenting with a new CSS framework.  

I also wrote a small script to automate a repetitive task, which saved me hours. Little daily improvements like these add up over time.  

Remember: coding is as much about practice as it is about problem-solving mindset. Keep learning, experimenting, and documenting your journey.
      `,
      published: true,
      userId: createdUsers[2].id,
    },
    {
      title: "Unpublished Secrets",
      content: `
Some posts are still drafts, waiting for the right moment to be shared. Keeping unpublished drafts allows you to organize your thoughts and polish your content.  

This post is an example of content that may never go public, but it helps us understand the workflow and benefits of separating published and unpublished posts.  

Sometimes, private notes are just as valuable as public articles — they track your learning journey and reflections.
      `,
      published: false,
      userId: createdUsers[3].id,
    },
  ];

  const createdPosts = [];
  for (const p of postsData) {
    const post = await prisma.post.create({ data: p });
    createdPosts.push(post);
  }

  // Create comments
  const commentsData = [
    {
      content: "Great introduction! Really sets the tone for the blog.",
      userId: createdUsers[1].id,
      postId: createdPosts[0].id,
    },
    {
      content: "Thanks for sharing this detailed post.",
      userId: createdUsers[2].id,
      postId: createdPosts[0].id,
    },
    {
      content: "Very helpful React tips. I will apply them in my projects.",
      userId: createdUsers[0].id,
      postId: createdPosts[1].id,
    },
    {
      content: "I like this! Especially the part about memoization.",
      userId: createdUsers[3].id,
      postId: createdPosts[1].id,
    },
    {
      content: "Looking forward to more posts like this.",
      userId: createdUsers[2].id,
      postId: createdPosts[3].id,
    },
    {
      content: "Can't wait for this draft to be published!",
      userId: createdUsers[1].id,
      postId: createdPosts[2].id,
    },
    {
      content: "Interesting perspective on daily coding habits.",
      userId: createdUsers[0].id,
      postId: createdPosts[3].id,
    },
    {
      content: "Keep up the good work, looking forward to new posts!",
      userId: createdUsers[3].id,
      postId: createdPosts[0].id,
    },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({ data: c });
  }

  console.log("✅ Database seeded with longer posts and multiple comments!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
