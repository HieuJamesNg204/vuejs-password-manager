<script setup>
import FacebookIcon from '@/assets/FacebookIcon.vue';
import GitHubIcon from '@/assets/GitHubIcon.vue';

// Developer information
const developer = {
  name: 'Hieu JavaPaws',
  role: 'Java Developer',
  bio: 'I am passionate about building web applications that are both functional and delightful to use. This app is a reflection of my commitment to simplicity and efficiency.',
  image: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/469381615_2143883642676084_201204658095058450_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH7Ol---3I12XsKTWKLTwy-kfUVM6mGKaCR9RUzqYYpoN-GDk8bEGskyXeHvdx4l7qaqX-BlOu7doMy2wy-EIqq&_nc_ohc=SBuDldSZ5sgQ7kNvgGKYYkZ&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=Auy710mrBQ6eaHqmh5lgGvr&oh=00_AYCWZJ3W2P4H85ZTWNAGrUG_lOdacQ3SszHmdSEmsimacQ&oe=67584CB5',
  socialLinks: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=100011634061799',
      icon: FacebookIcon,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/HieuJamesNg204',
      icon: GitHubIcon,
    },
  ],
};
</script>

<template>
  <div class="pt-16 p-6 max-w-6xl mx-auto">
    <!-- Header Section -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-800">About This App</h1>
      <p class="mt-4 text-gray-600 max-w-xl mx-auto">
        Hi there! If you somehow happen to get here, 
        I actually created this SecurePass app to help me keep track of my favourite tools and resources in a simple and organised way. 
        It’s tailored to make my workflow smoother and keep everything I need in one place.
        Just feel free to explore my app's features.
      </p>
    </div>

    <!-- Features Section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li>Simple and intuitive app management.</li>
        <li>Real-time updates with secure data handling.</li>
        <li>Fully customisable for various needs.</li>
      </ul>
    </div>

    <!-- Developer Section -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">About the Developer</h2>
      <div class="bg-white shadow-lg rounded-lg p-6 inline-block text-center">
        <img 
          :src="developer.image" 
          alt="Developer" 
          class="w-24 h-24 mx-auto rounded-full mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-800">{{ developer.name }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ developer.role }}</p>
        <p class="text-gray-700">{{ developer.bio }}</p>
        <!-- Social Links -->
        <div class="flex justify-center space-x-4 mt-4">
          <a 
            v-for="(link, index) in developer.socialLinks" 
            :key="index" 
            :href="link.url" 
            target="_blank" 
            class="text-gray-600 hover:text-blue-600"
          >
            <component :is="link.icon" class="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Additional styles, if needed */
</style>
