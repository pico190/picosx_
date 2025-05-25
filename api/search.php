<?php

$bangs = [
    '!g' => [
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
    '!w' => [
        "name" => "Wikipedia",
        "redirection" => "https://en.wikipedia.org/wiki/Special:Search?search={input}"
    ],
    '!d' => [
        "name" => "Deepseek",
        "redirection" => "https://deepseek.com/search?q={input}"
    ],
    '<void>' => [
        "name" => "Google",
        "redirection" => "https://www.google.com/search?q={input}"
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
            'redirection' => '/?clock=true',
        ],
        'gh' => [
            'name' => 'Github',
            'redirection' => 'https://github.com/',
        ],
        'whats' => [
            'name' => 'WhatsApp',
            'redirection' => 'https://web.whatsapp.com/',
        ],
        'disc' => [
            'name' => 'Discord',
            'redirection' => 'https://discord.com/',
        ],
        'twitter' => [
            'name' => 'Twitter (X)',
            'redirection' => 'https://twitter.com/',
        ],
    ];

    // Check redirecciones exactas
    if (array_key_exists($query, $redirects)) {
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
        echo "No se encontró ningún bang predeterminado 💀";
    }
} else {
    echo "No hay query para buscar 💀";
}