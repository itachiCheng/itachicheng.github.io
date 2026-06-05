'use strict';

const path = require('path');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

hexo.extend.filter.register('after_post_render', function normalizePostAssetPath(data) {
  if (!data.source || !data.content) return data;

  const postName = path.basename(data.source, path.extname(data.source));
  if (!postName) return data;

  const prefix = escapeRegExp(`./${postName}/`);
  const assetPathPattern = new RegExp(`((?:src|href)=["'])${prefix}`, 'g');
  data.content = data.content.replace(assetPathPattern, '$1./');

  return data;
});
