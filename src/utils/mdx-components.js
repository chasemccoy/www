import React from 'react';
import Link from '../components/Link';
import Pre from '../components/Pre';
import Image from '../components/Image';
import Bookmark from '../components/Bookmark';
import Video from '../components/Video';
import Callout from '../components/Callout';

const components = {
	Callout: Callout,
	Link,
	Wide: React.Fragment,
	Video: Video,
	Bookmark: Bookmark,
	pre: Pre,
	a: Link,
	img: Image
};

export default components;
