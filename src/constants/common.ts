export const jwtConstants = {
  secret: 'quang-test-jwt',
  expiredAccessToken: '7d',
  expiredRefreshToken: '30d',
};

export const paginationQuery = [
  { name: 'page', required: false, type: Number, description: 'Page number for pagination' },
  { name: 'size', required: false, type: Number, description: 'Size of items per page' },
];
