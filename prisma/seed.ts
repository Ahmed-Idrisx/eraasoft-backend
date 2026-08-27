import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { courses } from "./data/courses";
import { articles } from "./data/articles";
import { faqs } from "./data/faq";
import { features } from "./data/features";
import { partners } from "./data/partners";
import { journeySteps } from "./data/journey";
import { freeCourses } from "./data/free-courses";

const prisma = new PrismaClient();

async function seedUser() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "test@eraasoft.com",
    },
    update: {},
    create: {
      firstName: "Test",
      lastName: "User",
      email: "test@eraasoft.com",
      password,
    },
  });

  console.log(`✅ User: ${user.email}`);
}
async function seedCourses() {
  console.log(`🌱 Seeding ${courses.length} courses...`);

  for (const course of courses) {
    const data = {
      title: course.title,
      slug: course.slug,
      image: course.image,
      backgroundImage: course.background_image,
      description: course.description,
      whatWillLearn: course.what_will_learn,

      practicalAssignmentsNumber: course.practical_assignments_number,

      courseProjectsNumber: course.course_projects_number,

      price: new Prisma.Decimal(course.price),
      discount: new Prisma.Decimal(course.discount),
      finalPrice: new Prisma.Decimal(course.final_price),

      weeksNumber: course.weeks_number,
      hoursNumber: course.hours_number,

      rating: new Prisma.Decimal(course.rating),
      reviewsCount: course.reviews_count,

      features: course.features,

      content: course.content as unknown as Prisma.InputJsonValue,

      testimonials: course.testimonials as unknown as Prisma.InputJsonValue,

      relatedCourses:
        course.related_courses as unknown as Prisma.InputJsonValue,

      category: course.category,
    };

    await prisma.course.upsert({
      where: {
        slug: course.slug,
      },
      update: data,
      create: data,
    });

    console.log(`✔ ${course.title}`);
  }
}
async function seedArticles() {
  console.log(`🌱 Seeding ${articles.length} articles...`);

  for (const article of articles) {
    const data = {
      title: article.title,
      slug: article.slug,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      publishedAt: new Date(article.published_at),
      views: article.views,
      author: article.author,
      categories: article.categories,
    };

    await prisma.article.upsert({
      where: {
        slug: article.slug,
      },
      update: data,
      create: data,
    });

    console.log(`✔ ${article.title}`);
  }
}
async function seedFaqs() {
  console.log(`🌱 Seeding ${faqs.length} FAQs...`);

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: {
        question: faq.question,
      },
      update: {
        answer: faq.answer,
      },
      create: {
        question: faq.question,
        answer: faq.answer,
      },
    });

    console.log(`✔ ${faq.question}`);
  }

  console.log("✔ FAQs seeded");
}
async function seedFeatures() {
  console.log(`🌱 Seeding ${features.length} features...`);

  for (const feature of features) {
    await prisma.feature.upsert({
      where: {
        title: feature.title,
      },
      update: {
        description: feature.description,
        icon: feature.icon,
      },
      create: {
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
      },
    });

    console.log(`✔ ${feature.title}`);
  }

  console.log("✔ Features seeded");
}
async function seedPartners() {
  console.log(`🌱 Seeding ${partners.length} partners...`);

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: {
        name: partner.name,
      },
      update: {
        image: partner.image,
      },
      create: {
        name: partner.name,
        image: partner.image,
      },
    });

    console.log(`✔ ${partner.name}`);
  }

  console.log("✔ Partners seeded");
}
async function seedJourneySteps() {
  console.log(`🌱 Seeding ${journeySteps.length} journey steps...`);

  for (const step of journeySteps) {
    await prisma.journeyStep.upsert({
      where: {
        title: step.title,
      },
      update: {
        description: step.description,
        icon: step.icon,
        points: step.points,
      },
      create: {
        title: step.title,
        description: step.description,
        icon: step.icon,
        points: step.points,
      },
    });

    console.log(`✔ ${step.title}`);
  }

  console.log("✔ Journey steps seeded");
}
async function seedFreeCourses() {
  console.log(`🌱 Seeding ${freeCourses.length} free courses...`);

  for (const course of freeCourses) {
    const data = {
      title: course.title,
      slug: course.slug,
      shortDescription: course.short_description,
      description: course.description,
      image: course.image,
      backgroundImage: course.background_image,
      isFeatured: course.is_featured,
      videosCount: course.videos_count,
      isFree: course.is_free,
      videos: course.videos as unknown as Prisma.InputJsonValue,
    };

    await prisma.freeCourse.upsert({
      where: {
        slug: course.slug,
      },
      update: data,
      create: data,
    });

    console.log(`✔ ${course.title}`);
  }

  console.log("✔ Free courses seeded");
}
async function main() {
  console.log("🌱 Starting database seed...");

  await seedUser();
  await seedCourses();
  await seedArticles();
  await seedFaqs();
  await seedFeatures();
  await seedPartners();
  await seedJourneySteps();
  await seedFreeCourses();

  console.log("✅ Database seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
