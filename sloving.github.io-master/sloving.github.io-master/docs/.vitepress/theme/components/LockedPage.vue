<template>
  <div v-if="isLocked" class="locked-page">
    <p class="description">请输入密码以查看此页面</p>
    <input v-model="passwordInput" type="password" class="password-input" placeholder="输入密码"/>
    <ElButton @click="unlockPage" class="unlock-button">解锁</ElButton>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script setup>

import {ref} from 'vue';

const correctHash = '20000929';// 从环境变量中获取哈希值
const passwordInput = ref('');
const isLocked = ref(true);
const error = ref('');

const unlockPage = () => {
  console.log(`输入密码: ${passwordInput.value}`);  // 用于调试
  console.log(`正确密码: ${correctHash}`);  // 用于调试
  if (passwordInput.value === correctHash) {
    const unlockData = {
      unlocked: true,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem('pageUnlockData', JSON.stringify(unlockData));
    isLocked.value = false;
    error.value = '';
  } else {
    error.value = '密码错误，请重试';
  }
};

// 检查本地存储中是否已有解锁标记且未过期
const storedData = localStorage.getItem('pageUnlockData');
if (storedData) {
  const {unlocked, timestamp} = JSON.parse(storedData);
  const currentTime = new Date().getTime();
  const expirationTime = 24 * 60 * 60 * 1000; // 24小时
  if (unlocked && currentTime - timestamp < expirationTime) {
    isLocked.value = false;
  }
}
</script>
<style scoped>
.locked-page {
  max-width: 100%;
  margin: auto;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}


.description {
  font-size: 22px;
  margin-bottom: 20px;
}

.password-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.unlock-button {
  padding: 10px 20px;
  color: white;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.unlock-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  margin-top: 20px;
}
</style>