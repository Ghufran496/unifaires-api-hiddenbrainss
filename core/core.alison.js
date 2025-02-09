const {useAsync} = require("./index");

function convertToCamelCase(obj) {
    const convertedObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
                letter.toUpperCase()
            );
            convertedObj[camelCaseKey] = obj[key];
        }
    }
    return convertedObj;
}

exports.courses = useAsync(
    async (page = 1, locale = "en", size = 100, language = "en") => {
        //get list of courses here

        const response = await (
            await fetch(
                `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&language=${language}&order=default&include_summary=1`
            )
        ).json();

        let courses = response.result;
        let total = response.total;
        let aggregations = response.aggregations;

        let level = aggregations.level.map((lev) => {
            return {
                name:
                    lev.key === 1
                        ? "Beginner"
                        : lev.key === 2
                            ? "Intermediate"
                            : lev.key === 3
                                ? "Advanced"
                                : "",
                api: `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&level=${lev.key}&language=${language}&order=default&include_summary=1`,
                ...lev,
            };
        });

        let type = aggregations.course_type_id.map((lev) => {
            let name = lev.key === 1 ? "certificate" : lev.key === 2 ? "diploma" : "";
            return {
                name,
                api: `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&type=${name}&language=${language}&order=default&include_summary=1`,
                ...lev,
            };
        });

        let duration = aggregations.avg_duration_search.map((lev) => {
            let name = lev.key;
            return {
                name,
                api: `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&type=${name}&language=${language}&order=default&include_summary=1`,
                ...lev,
            };
        });

        let category = aggregations.category_slug.map((lev) => {
            let name = lev.key;
            return {
                name,
                api: `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&category=${lev.key}&language=${language}&order=default&include_summary=1`,
                ...lev,
            };
        });

        aggregations = {
            level,
            type,
            duration,
            category,
        };

        courses = courses.map((course,index) => {
            // return {
            //     meta: {image: course.courseImgUrl},
            //     description: course.headline,
            //     organizationName: course.publisher_name,
            //     aboutOrganization: course.publisher_display_name,
            //     scope: course.tags,
            //     requirement: course,
            //     target: course,
            //     lang: course,
            //     level: course,
            //     welcomeMessage: course,
            //     congratulationMessage: course,
            // }

            return {
                id: +index + 1,
                isUnifaires: false,
                organizationName: "Alison",
                aboutOrganization:
                    "Alison was founded in Galway, Ireland, in 2007 and has grown organically to become a major force in free online education and skills training. Today, with more than 30 million learners in 195 countries, Alison is changing how the world learns and up-skills.\n" +
                    "\n" +
                    "We are committed to equality and access to education and skills training irrespective of gender, geography, economic status or any other barriers that can so often stunt potential. So we offer a range of free courses that meet the many diverse needs of our learners. The UN declared in Article 26 of the 1946 Declaration of Human Rights that “Education shall be free…”. This statement will always inspire us.\n" +
                    "\n" +
                    "Alison was founded by Alison CEO, Mike Feerick. Mike is a businessman, but one with a difference. He believes in social impact, and that you can build a financially successful business focused on meeting a huge global social need, making education and skills training more accessible for everyone. He invites anyone who believes that too, to support the Alison mission.\n" +
                    "\n" +
                    "Alison is free of charge to you. But it’s still a business – albeit a socially-focused one. We are a social enterprise making our money through advertising, merchandise, and the sale of Certificates and Diplomas, should a graduate choose to buy one.",
                organizationLogo:
                    "https://i.im.ge/2023/07/16/50vwca.ALISON-Logo2022-full-color.png",
                courseUrl: `https://alison.com/course/${course.slug}`,
                courseApi: `https://alison.com/api/v1/courses/${course.id}`,
                ...convertToCamelCase(course),
            };
        });

        return {total, courses, aggregations};
    }
);

exports.combine = useAsync(
    async (page = 1, locale = "en", size = 100, language = "en") => {
        //get list of courses here

        const response = await (
            await fetch(
                `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&language=${language}&order=default&include_summary=1`
            )
        ).json();

        let courses = response.result;
        let total = response.total;

        courses = courses.map((course, index) => {
            return {
                id: +index + 1,
                isUnifaires: false,
                organizationName: "Alison",
                aboutOrganization:
                    "Alison was founded in Galway, Ireland, in 2007 and has grown organically to become a major force in free online education and skills training. Today, with more than 30 million learners in 195 countries, Alison is changing how the world learns and up-skills.\n" +
                    "\n" +
                    "We are committed to equality and access to education and skills training irrespective of gender, geography, economic status or any other barriers that can so often stunt potential. So we offer a range of free courses that meet the many diverse needs of our learners. The UN declared in Article 26 of the 1946 Declaration of Human Rights that “Education shall be free…”. This statement will always inspire us.\n" +
                    "\n" +
                    "Alison was founded by Alison CEO, Mike Feerick. Mike is a businessman, but one with a difference. He believes in social impact, and that you can build a financially successful business focused on meeting a huge global social need, making education and skills training more accessible for everyone. He invites anyone who believes that too, to support the Alison mission.\n" +
                    "\n" +
                    "Alison is free of charge to you. But it’s still a business – albeit a socially-focused one. We are a social enterprise making our money through advertising, merchandise, and the sale of Certificates and Diplomas, should a graduate choose to buy one.",
                organizationLogo:
                    "https://i.im.ge/2023/07/16/50vwca.ALISON-Logo2022-full-color.png",
                courseUrl: `https://alison.com/course/${course.slug}`,
                courseApi: `https://alison.com/api/v1/courses/${course.id}`,
                meta: {image: course.courseImgUrl},
                description: course.headline,
                scope: course.tags,
                requirement: "",
                target: course.outcomes,
                lang: course.locale,
                level: course.level,
                name: course.name,
                slug: course.slug,
                welcomeMessage: "",
                congratulationMessage: "course",
                ...convertToCamelCase(course),
            };
        });

        return {total, courses};
    }
);

exports.search = useAsync(
    async (query, tag, page = 1, locale = "en", size = 100, language = "en") => {
        //get list of courses here

        const response = await (
            await fetch(
                `https://api.alison.com/v0.1/search?page=${page}&locale=${locale}&size=${size}&query=${query}&tag=${tag}&language=${language}&order=default&include_summary=1`
            )
        ).json();

        let courses = response.result;
        let total = response.total;
        courses = courses.map((course, index) => {
            return {
                id: +index + 1,
                isUnifaires: false,
                organizationName: "Alison",
                aboutOrganization:
                    "Alison was founded in Galway, Ireland, in 2007 and has grown organically to become a major force in free online education and skills training. Today, with more than 30 million learners in 195 countries, Alison is changing how the world learns and up-skills.\n" +
                    "\n" +
                    "We are committed to equality and access to education and skills training irrespective of gender, geography, economic status or any other barriers that can so often stunt potential. So we offer a range of free courses that meet the many diverse needs of our learners. The UN declared in Article 26 of the 1946 Declaration of Human Rights that “Education shall be free…”. This statement will always inspire us.\n" +
                    "\n" +
                    "Alison was founded by Alison CEO, Mike Feerick. Mike is a businessman, but one with a difference. He believes in social impact, and that you can build a financially successful business focused on meeting a huge global social need, making education and skills training more accessible for everyone. He invites anyone who believes that too, to support the Alison mission.\n" +
                    "\n" +
                    "Alison is free of charge to you. But it’s still a business – albeit a socially-focused one. We are a social enterprise making our money through advertising, merchandise, and the sale of Certificates and Diplomas, should a graduate choose to buy one.",
                organizationLogo:
                    "https://i.im.ge/2023/07/16/50vwca.ALISON-Logo2022-full-color.png",
                courseUrl: `https://alison.com/course/${course.slug}`,
                courseApi: `https://alison.com/api/v1/courses/${course.id}`,
                ...convertToCamelCase(course),
            };
        });

        return {courses, total, aggregations: response.aggregations};
    }
);
