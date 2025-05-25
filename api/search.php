<?php

$bangs = [
    '!gh' => [
        "name" => "Github",
        "redirection" => "https://github.com/search?q={input}"
    ],
    '!y' => [
        "name" => "YouTube",
        "redirection" => "https://www.youtube.com/results?search_query={input}"
    ],
    '!s' => [
        "name" => "Stackoverflow",
        "redirection" => "https://stackoverflow.com/search?q={input}"
    ],
    '!g' => [
        "name" => "Google",
        "redirection" => "https://www.google.com/search?q={input}"
    ],
    '!w' => [
        "name" => "Wikipedia",
        "redirection" => "https://en.wikipedia.org/wiki/Special:Search?search={input}"
    ],
    '!ch' => [
        'name' => 'ChoniGPT',
        'redirection' => 'https://chonigpt.vercel.app/app/?createChat={input}&referer=picosx'
    ],
    '!d' => [
        "name" => "Deepseek",
        "redirection" => "https://picosx.vercel.app/?deepseek=true&a={input}"
    ],
    '!i' => [
        "name" => "Google Images",
        "redirection" => "https://www.google.com/search?q={input}&sclient=img&udm=2"
    ],
    '!m' => [
        "name" => "Google Maps",
        "redirection" => "https://www.google.com/maps/search/{input}"
    ],
    '<void>' => [
        "name" => "Brave Search",
        "redirection" => "https://search.brave.com/search?q={input}&lang=es"
    ]
];

function getQueryParams($url)
{
    $parsedUrl = parse_url($url);
    $params = [];
    if (!empty($parsedUrl['query'])) {
        parse_str($parsedUrl['query'], $params);
    }
    return $params;
}

function redirectTo($url)
{
    header("Location: $url");
    exit();
}

$params = getQueryParams($_SERVER['REQUEST_URI']);

if (isset($params['q'])) {
    $query = $params['q'];
    $redirects = [
        'gpt' => [
            'name' => 'ChatGPT',
            'redirection' => 'https://chatgpt.com/',
        ],
        'ch' => [
            'name' => 'ChoniGPT',
            'redirection' => 'https://chonigpt.vercel.app',
        ],
        'cgpt' => [
            'name' => 'ChoniGPT',
            'redirection' => 'https://chonigpt.vercel.app',
        ],
        'chonigpt' => [
            'name' => 'ChoniGPT',
            'redirection' => 'https://chonigpt.vercel.app',
        ],
        'dyt' => [
            'name' => 'Youtubed',
            'redirection' => 'https://youtubedd.vercel.app',
        ],
        'youtubed' => [
            'name' => 'Youtubed',
            'redirection' => 'https://youtubedd.vercel.app',
        ],
        'yt' => [
            'name' => 'Youtube',
            'redirection' => 'https://www.youtube.com/',
        ],
        'exc' => [
            'name' => 'Excalidraw',
            'redirection' => 'https://excalidraw.com/',
        ],
        'time' => [
            'name' => 'Open clock',
            'redirection' => 'https://picosx.vercel.app/?clock=true',
        ],
        'gh' => [
            'name' => 'Github',
            'redirection' => 'https://github.com/',
        ],
        'git' => [
            'name' => 'Github',
            'redirection' => 'https://github.com/',
        ],
        'github' => [
            'name' => 'Github',
            'redirection' => 'https://github.com/',
        ],
        'whatsapp' => [
            'name' => 'WhatsApp',
            'redirection' => 'https://web.whatsapp.com/',
        ],
        'whats' => [
            'name' => 'WhatsApp',
            'redirection' => 'https://web.whatsapp.com/',
        ],
        'disc' => [
            'name' => 'Discord',
            'redirection' => 'https://discord.com/',
        ],
        'tw' => [
            'name' => 'Twitter (X)',
            'redirection' => 'https://twitter.com/',
        ],
        'twitter' => [
            'name' => 'Twitter (X)',
            'redirection' => 'https://twitter.com/',
        ],
        'canva' => [
            'name' => 'Canva',
            'redirection' => 'https://www.canva.com/es_es/',
        ],
        'figma' => [
            'name' => 'Figma',
            'redirection' => 'https://www.figma.com/',
        ],
        'picosx' => [
            'name' => 'PicoSX',
            'redirection' => 'https://picosx.vercel.app/',
        ],
    ];

    // Check redirecciones exactas
    if (array_key_exists(strtolower($query), $redirects)) {
        redirectTo($redirects[$query]['redirection']);
    }

    // Check bangs
    foreach ($bangs as $bang => $data) {
        if (str_starts_with($query, $bang)) {
            $input = trim(str_replace($bang, "", $query));
            $url = str_replace("{input}", urlencode($input), $data['redirection']);
            redirectTo($url);
        }
    }

    // Check traducción tipo "en=>es:hello"
    if (strlen($query) <= 12 && str_contains($query, '=>')) {
        [$lang1, $rest] = explode("=>", $query, 2);
        if (str_contains($rest, ":")) {
            [$lang2, $text] = explode(":", $rest, 2);
            $url = "https://translate.google.es/?sl=" . urlencode($lang1) .
                "&tl=" . urlencode($lang2) .
                "&text=" . urlencode($text) .
                "&op=translate";
            redirectTo($url);
        } else {
            $url = "https://translate.google.es/?sl=" . urlencode($lang1) .
                "&tl=" . urlencode($rest) .
                "&op=translate";
            redirectTo($url);
        }
    }

    // Default: búsqueda con el bang "<void>" (como en tu código JS)
    if (isset($bangs['<void>'])) {
        $url = str_replace("{input}", urlencode($query), $bangs['<void>']['redirection']);
        redirectTo($url);
    } else {
        header("Location: https://picosx.vercel.app/");
    }
} else {
    header("Location: https://picosx.vercel.app/");
}