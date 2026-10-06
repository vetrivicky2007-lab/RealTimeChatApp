package chat.service;

import chat.model.Group;
import chat.model.Post;
import chat.model.PostComment;
import chat.model.User;
import chat.repository.GroupRepository;
import chat.repository.PostCommentRepository;
import chat.repository.PostRepository;
import chat.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class DataSeeder implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    public static final String COMMON_PASSWORD = "UniDemo2026!";

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    private Map<String, Object> latestReport = new LinkedHashMap<>();

    public DataSeeder(
            UserRepository userRepository,
            GroupRepository groupRepository,
            PostRepository postRepository,
            PostCommentRepository commentRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            logger.info("Initializing UniHive / UniAI automatic demo data seeding...");
            Map<String, Object> report = seedAll(false);
            logger.info("UniHive demo data seeding completed successfully: {} communities, {} posts verified.",
                    report.get("totalCommunities"), report.get("totalPosts"));
        } catch (Exception e) {
            logger.warn("Automatic database seeding deferred or encountered an issue (e.g. database offline during test/dev): {}",
                    e.getMessage());
        }
    }

    public synchronized Map<String, Object> seedAll(boolean force) {
        Map<String, Object> report = new LinkedHashMap<>();
        Instant startTime = Instant.now();

        // 1. Seed / verify demo users & amudavikki
        Map<String, User> userMap = seedUsers();

        // 2. Seed / verify 7 public communities
        List<Group> communities = seedCommunities(userMap);

        // 3. Seed posts for every community
        int totalPosts = seedPosts(communities, userMap);

        // 4. Generate structured report
        List<Map<String, Object>> communitySummaries = new ArrayList<>();
        User amudavikki = userMap.get("amudavikki");
        boolean amudavikkiInAll = true;

        for (Group group : communities) {
            Map<String, Object> cs = new LinkedHashMap<>();
            cs.put("id", group.getId());
            cs.put("name", group.getName());
            cs.put("description", group.getDescription());
            cs.put("privacy", group.getPrivacy());
            cs.put("avatarUrl", group.getAvatarUrl());
            cs.put("memberCount", group.getMemberCount());

            List<String> memberUsernames = new ArrayList<>();
            for (String mId : group.getMembers()) {
                userRepository.findById(mId).ifPresent(u -> memberUsernames.add(u.getUsername()));
            }
            cs.put("members", memberUsernames);
            long postCount = postRepository.countByCommunityId(group.getId());
            cs.put("postCount", postCount);

            if (amudavikki != null && !group.hasMember(amudavikki.getId())) {
                amudavikkiInAll = false;
            }

            communitySummaries.add(cs);
        }

        List<Map<String, String>> credentials = new ArrayList<>();
        credentials.add(Map.of("username", "amudavikki", "displayName", "Amuda Vikki (Main User)", "email", userMap.get("amudavikki").getEmail(), "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "elena_rostova", "displayName", "Elena Rostova", "email", "elena.rostova@uniai.io", "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "marcus_chen", "displayName", "Marcus Chen", "email", "marcus.chen@uniai.io", "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "sarah_jenkins", "displayName", "Sarah Jenkins", "email", "sarah.jenkins@uniai.io", "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "arjun_patel", "displayName", "Arjun Patel", "email", "arjun.patel@uniai.io", "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "chloe_dubois", "displayName", "Chloe Dubois", "email", "chloe.dubois@uniai.io", "password", COMMON_PASSWORD));
        credentials.add(Map.of("username", "liam_vance", "displayName", "Liam Vance", "email", "liam.vance@uniai.io", "password", COMMON_PASSWORD));

        report.put("status", "SUCCESS");
        report.put("message", "UniHive / UniAI demo data populated successfully.");
        report.put("timestamp", Instant.now().toString());
        report.put("durationMs", Duration.between(startTime, Instant.now()).toMillis());
        report.put("amudavikkiMemberInAllCommunities", amudavikkiInAll);
        report.put("totalCommunities", communitySummaries.size());
        report.put("totalDemoUsers", credentials.size());
        report.put("totalPosts", totalPosts);
        report.put("communities", communitySummaries);
        report.put("userCredentials", credentials);

        this.latestReport = report;
        return report;
    }

    public Map<String, Object> getLatestReport() {
        if (latestReport.isEmpty()) {
            return seedAll(false);
        }
        return latestReport;
    }

    private Map<String, User> seedUsers() {
        Map<String, User> userMap = new LinkedHashMap<>();
        String encodedPassword = passwordEncoder.encode(COMMON_PASSWORD);

        // 1. amudavikki (main user account)
        User amudavikki = userRepository.findByUsernameIgnoreCase("amudavikki").orElse(null);
        if (amudavikki == null) {
            amudavikki = new User("amudavikki", "amudavikki@uniai.io", encodedPassword);
            amudavikki.setStatus("ACTIVE");
            amudavikki.setCreatedAt(Instant.now().minus(Duration.ofDays(30)));
            amudavikki.setUpdatedAt(Instant.now());
            amudavikki = userRepository.save(amudavikki);
            logger.info("Created main user account: amudavikki");
        } else {
            logger.info("Found existing main user account: amudavikki ({})", amudavikki.getId());
        }
        userMap.put("amudavikki", amudavikki);

        // 2. Additional realistic demo users
        List<DemoUserDefinition> demoDefs = List.of(
                new DemoUserDefinition("elena_rostova", "elena.rostova@uniai.io"),
                new DemoUserDefinition("marcus_chen", "marcus.chen@uniai.io"),
                new DemoUserDefinition("sarah_jenkins", "sarah.jenkins@uniai.io"),
                new DemoUserDefinition("arjun_patel", "arjun.patel@uniai.io"),
                new DemoUserDefinition("chloe_dubois", "chloe.dubois@uniai.io"),
                new DemoUserDefinition("liam_vance", "liam.vance@uniai.io")
        );

        for (DemoUserDefinition def : demoDefs) {
            User user = userRepository.findByUsernameIgnoreCase(def.username).orElse(null);
            if (user == null) {
                user = new User(def.username, def.email, encodedPassword);
                user.setStatus("ACTIVE");
                user.setCreatedAt(Instant.now().minus(Duration.ofDays(25)));
                user.setUpdatedAt(Instant.now());
                user = userRepository.save(user);
                logger.info("Created demo user: {}", def.username);
            }
            userMap.put(def.username, user);
        }

        return userMap;
    }

    private List<Group> seedCommunities(Map<String, User> userMap) {
        List<GroupDefinition> definitions = List.of(
                new GroupDefinition(
                        "AI & Machine Learning Innovators",
                        "A collaborative hub for AI researchers, ML engineers, and curious minds. We share breakthroughs in Large Language Models (LLMs), neural architectures, diffusion models, reinforcement learning, and open-source AI tooling. Discuss papers, benchmark models, and explore ethical AI implementations.",
                        "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
                        "Artificial Intelligence"
                ),
                new GroupDefinition(
                        "CodeCraft: Software & Architecture",
                        "The gathering place for engineers who care about craft, scalability, and system design. Discuss modern backend services, TypeScript and Rust patterns, clean code principles, database indexing strategies, distributed consensus, and developer productivity tools.",
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                        "Programming"
                ),
                new GroupDefinition(
                        "PixelRealm: Gaming & Esports",
                        "Dedicated to gaming culture, indie discoveries, competitive esports, and next-gen hardware. Share game reviews, gameplay tips, custom PC build setups, speedrunning highlights, and industry news from both AAA studios and passionate indie developers.",
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                        "Gaming"
                ),
                new GroupDefinition(
                        "CineVerse: Cinema & Storytelling",
                        "A vibrant space for cinephiles, screenwriters, and movie enthusiasts. From deep narrative analyses and cinematography dissections to indie film recommendations, festival retrospectives, and discussions on the golden age of cinema and television.",
                        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
                        "Entertainment"
                ),
                new GroupDefinition(
                        "ShutterCraft: Photography & Visuals",
                        "An inspiring collective of street, portrait, landscape, and astrophotographers. Share RAW camera settings, post-processing techniques in Lightroom and Capture One, lens recommendations, lighting setups, and your visual storytelling portfolios.",
                        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                        "Photography"
                ),
                new GroupDefinition(
                        "VentureForge: Startups & Builders",
                        "For founders, operators, bootstrappers, and venture builders turning ideas into sustainable businesses. Discuss product-market fit, customer discovery interviews, pricing strategies, SaaS unit economics, pitch decks, and bootstrapping versus venture funding.",
                        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
                        "Startups"
                ),
                new GroupDefinition(
                        "TechPulse: Gadgets & Future Tech",
                        "The hub for hardware enthusiasts, mobile innovators, and futuristic consumer tech. We review the latest silicon innovations, foldable smartphones, smart home automation setups, wearable health sensors, VR/AR headsets, and emerging energy tech.",
                        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
                        "Technology"
                )
        );

        List<Group> result = new ArrayList<>();
        User amudavikki = userMap.get("amudavikki");
        String creatorId = amudavikki.getId();

        for (GroupDefinition def : definitions) {
            Group group = groupRepository.findByNameIgnoreCase(def.name).orElse(null);
            boolean isNew = false;
            if (group == null) {
                group = new Group(def.name, def.description, creatorId, "PUBLIC", null);
                group.setAvatarUrl(def.avatarUrl);
                group.setCreatedAt(Instant.now().minus(Duration.ofDays(20)));
                isNew = true;
            } else {
                group.setDescription(def.description);
                group.setAvatarUrl(def.avatarUrl);
                group.setPrivacy("PUBLIC");
            }

            // Ensure amudavikki AND all demo users are members
            for (User u : userMap.values()) {
                group.addMember(u.getId());
            }

            group.setUpdatedAt(Instant.now());
            Group saved = groupRepository.save(group);
            result.add(saved);

            if (isNew) {
                logger.info("Created community: {} with {} members", saved.getName(), saved.getMemberCount());
            } else {
                logger.info("Updated existing community: {} with {} members", saved.getName(), saved.getMemberCount());
            }
        }

        return result;
    }

    private int seedPosts(List<Group> communities, Map<String, User> userMap) {
        int totalPosts = 0;

        for (Group group : communities) {
            long existingCount = postRepository.countByCommunityId(group.getId());
            if (existingCount >= 10) {
                logger.info("Community '{}' already has {} posts. Skipping creation to preserve data.",
                        group.getName(), existingCount);
                totalPosts += existingCount;
                continue;
            }

            List<PostSeedData> postList = getPostsForCommunity(group.getName());
            int index = 0;
            for (PostSeedData data : postList) {
                User author = userMap.getOrDefault(data.authorKey, userMap.get("amudavikki"));
                Instant postTime = Instant.now().minus(Duration.ofHours((postList.size() - index) * 16 + 2));

                Post post = new Post(group.getId(), author.getId(), author.getUsername(), data.title, data.content);
                post.setMediaUrl(data.mediaUrl);
                post.setMediaType("IMAGE");
                post.setCategory(data.category);
                post.setTags(data.tags);
                post.setCreatedAt(postTime);
                post.setUpdatedAt(postTime);
                post.setLikeCount(data.likeCount);
                post.setDislikeCount(data.dislikeCount);
                post.setVerifiedCount(data.verifiedCount);
                post.setNotVerifiedCount(data.notVerifiedCount);
                post.setViewCount(data.viewCount);
                post.setCommentCount(data.comments.size());

                Post savedPost = postRepository.save(post);
                totalPosts++;

                // Seed comments for this post if any
                for (CommentSeedData cData : data.comments) {
                    User commentAuthor = userMap.getOrDefault(cData.authorKey, userMap.get("elena_rostova"));
                    Instant commentTime = postTime.plus(Duration.ofMinutes(15 + (long) (Math.random() * 120)));
                    PostComment comment = new PostComment(
                            savedPost.getId(),
                            group.getId(),
                            commentAuthor.getId(),
                            commentAuthor.getUsername(),
                            cData.content
                    );
                    comment.setCreatedAt(commentTime);
                    comment.setUpdatedAt(commentTime);
                    commentRepository.save(comment);
                }

                index++;
            }

            logger.info("Seeded {} posts for community '{}'", postList.size(), group.getName());
        }

        return totalPosts;
    }

    private List<PostSeedData> getPostsForCommunity(String communityName) {
        List<PostSeedData> list = new ArrayList<>();

        if (communityName.contains("AI & Machine Learning")) {
            list.add(new PostSeedData(
                    "Understanding Mixture of Experts (MoE): Architecture, Routing, and Efficiency",
                    "Mixture of Experts architectures have become the cornerstone of modern frontier models. By activating only a sparse subset of feed-forward network parameters per token, models achieve massive parameter capacity without linear increases in compute cost.\n\nIn this breakdown, we examine token routing strategies, auxiliary load-balancing losses, and the memory bandwidth challenges when deploying MoE models on enterprise GPU clusters. How are you handling MoE inference latency in your pipelines?",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("AI", "MoE", "MachineLearning", "DeepLearning"),
                    34, 1, 14, 1, 240,
                    List.of(
                            new CommentSeedData("marcus_chen", "Great analysis Elena! Expert capacity factor tuning is definitely where most teams struggle during inference scaling."),
                            new CommentSeedData("amudavikki", "We recently experimented with router z-loss to stabilize token assignment; it cut perplexity spikes during high-load intervals.")
                    )
            ));
            list.add(new PostSeedData(
                    "Local LLMs on Apple Silicon: Running 70B Models with MLX and 4-Bit Quantization",
                    "Apple Silicon's unified memory architecture has made high-throughput local inference accessible to developers. By combining 4-bit GGUF quantization with Apple's native MLX framework, developers can achieve over 25 tokens per second on an M3 Max with zero cloud latency.\n\nHere is a comprehensive breakdown of memory allocation profiles, metal shader optimizations, and temperature tuning for developers looking to run private air-gapped coding assistants.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("AppleSilicon", "LocalLLM", "Quantization", "MLX"),
                    45, 0, 18, 0, 310,
                    List.of(
                            new CommentSeedData("arjun_patel", "Running a 70B parameter model on a portable laptop without any cloud API calls is a game changer for privacy."),
                            new CommentSeedData("elena_rostova", "What kind of time-to-first-token are you getting on prompts exceeding 4k tokens?")
                    )
            ));
            list.add(new PostSeedData(
                    "Retrieval-Augmented Generation (RAG) vs. Long-Context Windows: Benchmark Results",
                    "With context windows expanding to millions of tokens, many engineers wondered if vector-based RAG pipelines were becoming obsolete. Our latest empirical benchmarks demonstrate that hybrid search (dense embeddings combined with sparse BM25) paired with cross-encoder rerankers still outperforms pure long-context retrieval in both accuracy and token cost by a wide margin.\n\nHere are our precision-at-k metrics and latency charts across 10,000 document queries.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("RAG", "VectorDB", "Embeddings", "Search"),
                    28, 2, 11, 2, 195,
                    List.of(
                            new CommentSeedData("sarah_jenkins", "The cost difference is huge. Passing 1M tokens on every user query is completely cost-prohibitive for consumer SaaS products.")
                    )
            ));
            list.add(new PostSeedData(
                    "State-of-the-Art Diffusion Models in Latent Space: Architecture Deep Dive",
                    "Latent diffusion transformed generative imagery by shifting the denoising process from pixel space to a compressed latent representation. This article explores continuous flow matching, classifier-free guidance scales, and how cross-attention layers bind textual prompt tokens to spatial representations.\n\nWe also examine recent work on rectified flow trajectories that enable high-fidelity generation in as few as 4 sampling steps.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("Diffusion", "GenerativeAI", "ComputerVision"),
                    39, 1, 15, 1, 280,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Direct Preference Optimization (DPO): Replacing Complex RLHF Pipelines",
                    "Reinforcement Learning from Human Feedback (RLHF) using PPO was notoriously unstable and resource-heavy. Direct Preference Optimization reformulates the objective function to directly optimize the policy using a closed-form solution.\n\nWe discuss how DPO stabilizes alignment, eliminates the need for separate reward model training loops, and reduces GPU cluster overhead by more than 40%.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("DPO", "RLHF", "ModelAlignment", "NLP"),
                    22, 0, 9, 0, 160,
                    List.of(
                            new CommentSeedData("amudavikki", "DPO made fine-tuning so much more predictable. The reward hacking problems we used to face in PPO are virtually gone.")
                    )
            ));
            list.add(new PostSeedData(
                    "Self-Correction Mechanisms in Autonomous Coding Agents",
                    "Building autonomous coding assistants requires more than single-shot generation. Implementing execution-feedback loops—where an agent reads compiler errors, linter output, and unit test failures to self-correct in multi-turn trajectories—dramatically increases benchmark solve rates.\n\nHere are the architectural patterns and prompt chains that proved most resilient against hallucinated library APIs.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("AgenticAI", "CodeGeneration", "SelfCorrection"),
                    51, 1, 21, 0, 360,
                    List.of(
                            new CommentSeedData("marcus_chen", "Multi-turn feedback is essential. Single-shot code generation without AST verification will always hallucinate imports.")
                    )
            ));
            list.add(new PostSeedData(
                    "Synthetic Data Generation: Mitigating Model Collapse in Frontier Training",
                    "As high-quality human-generated web text reaches its natural saturation limit, synthetic dataset curation has become the primary training frontier. We review automated verification pipelines, LLM-as-a-Judge validation, and contamination prevention protocols designed to avoid recursive model degradation.\n\nCan mathematical rigor in synthetic generation surpass noisy human scrape datasets?",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("SyntheticData", "Training", "DataEngineering"),
                    19, 2, 7, 1, 140,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Graph Neural Networks (GNNs) for Molecular Property Prediction",
                    "Transforming chemical graphs into invariant spatial representations enables rapid drug discovery and material science modeling. We examine message-passing neural networks (MPNNs), SE(3)-equivariant graph convolutions, and their predictive accuracy against physical laboratory assays.\n\nDiscover how structural biology and deep learning are converging in 2026.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("BioAI", "GNN", "DrugDiscovery", "GraphML"),
                    26, 0, 10, 0, 185,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "KV Cache Compression: StreamingLLM and Speculative Decoding in Production",
                    "Key-Value caching is the primary bottleneck for serving concurrent long-context requests. By maintaining initial attention sinks combined with rolling local tokens, StreamingLLM enables stable infinite-horizon generation with bounded VRAM footprints.\n\nHere are our production latency measurements using speculative drafting with small companion models.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("KVCache", "ModelServing", "InferenceOptimization"),
                    31, 0, 12, 0, 220,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Multi-Modal Reasoning: Bridging Vision, Audio, and Text Embeddings",
                    "Unified multi-modal tokenizers are replacing disconnected adapter architectures. When text, visual patches, and acoustic spectrograms share an interleaved token sequence, contextual grounding improves dramatically.\n\nWe review recent findings across vision-language benchmarks and real-time voice interaction latency.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("MultiModal", "VisionLLM", "AudioAI"),
                    24, 1, 8, 1, 175,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Open-Source Weights vs. Proprietary Cloud APIs: TCO Analysis for Enterprise",
                    "Total Cost of Ownership (TCO) comparisons between hosted proprietary endpoints and self-managed open-weight clusters (vLLM on H100 instances) reveal surprising inflection points.\n\nWe provide a mathematical model breaking down throughput thresholds, data governance mandates, and engineering maintenance overhead for technology leaders.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                    "Artificial Intelligence",
                    List.of("OpenSource", "vLLM", "CloudEconomics", "Enterprise"),
                    42, 2, 16, 1, 290,
                    List.of(
                            new CommentSeedData("elena_rostova", "Once you hit over 2 million tokens per day, self-hosting with vLLM pays for itself within weeks.")
                    )
            ));
        } else if (communityName.contains("CodeCraft")) {
            list.add(new PostSeedData(
                    "Designing Idempotent APIs: Handling Distributed Retries Without Side Effects",
                    "In distributed systems, network timeouts are inevitable. If a client retries a payment or order creation request, how do you ensure the operation executes exactly once?\n\nThis guide explores Idempotency-Key header design, atomic distributed locks with Redis SETNX, database unique constraints, and transaction boundary management to prevent duplicate side effects.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("API", "Architecture", "DistributedSystems"),
                    48, 1, 20, 0, 320,
                    List.of(
                            new CommentSeedData("amudavikki", "The Idempotency-Key pattern has saved us from duplicate billing countless times in production. Essential reading.")
                    )
            ));
            list.add(new PostSeedData(
                    "PostgreSQL Indexing Strategies: B-Tree, GIN, and BRIN Explained",
                    "Choosing the wrong index type can degrade write performance without helping read latency. While B-Tree is the default workhorse, GIN indexes shine for full-text search and JSONB containment queries, while BRIN indexes drastically cut memory overhead on massive append-only timeseries tables.\n\nHere is an index selection flowchart and query execution plan analysis.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Database", "PostgreSQL", "Performance"),
                    54, 0, 22, 1, 380,
                    List.of(
                            new CommentSeedData("marcus_chen", "BRIN indexes on timestamp columns saved us over 80GB of RAM on our audit log clusters!")
                    )
            ));
            list.add(new PostSeedData(
                    "Zero-Downtime Database Migrations: The Expand-Contract Pattern",
                    "Renaming columns or altering table structures in high-traffic applications without downtime requires careful orchestration. The Expand-Contract pattern breaks migrations into non-breaking, incremental phases: add column, dual-write in application code, backfill data, switch reads, and deprecate the old column.\n\nLearn how to automate this in your CI/CD pipelines.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("DevOps", "Database", "Microservices"),
                    37, 1, 13, 0, 250,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Rust Memory Safety in Practice: Concurrency Without Data Races",
                    "Rust's ownership and borrowing model enforces thread safety at compile time through the Send and Sync traits. In this practical code walkthrough, we build an asynchronous thread-pool worker using Arc, Mutex, and crossbeam channels, contrasting Rust's zero-cost abstractions with traditional runtime garbage collection pauses.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Rust", "SystemsProgramming", "Concurrency"),
                    41, 0, 16, 0, 290,
                    List.of(
                            new CommentSeedData("liam_vance", "The compiler warnings feel like pair-programming with a very strict senior engineer.")
                    )
            ));
            list.add(new PostSeedData(
                    "Event-Driven Microservices with Kafka: Dead-Letter Queues and Poison Pill Handling",
                    "Consuming messages from distributed partitions can fail unexpectedly due to corrupt schemas or downstream downtime. Without proper poison pill isolation and Dead-Letter Queue (DLQ) retry routing, a single bad message can stall partition processing for millions of downstream users.\n\nHere is an enterprise-grade retry pattern with exponential backoff.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Kafka", "Microservices", "EventDriven"),
                    33, 2, 11, 1, 230,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Clean Code vs. Pragmatic Engineering: Avoiding Over-Abstraction in Production",
                    "Engineers often fall into the trap of premature generalization, creating intricate factory hierarchies and abstract interfaces for code that only has a single concrete implementation. We advocate for the 'Rule of Three' and explain why copying code twice is often cheaper than introducing the wrong abstraction.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("CleanCode", "Refactoring", "Engineering"),
                    60, 2, 25, 2, 420,
                    List.of(
                            new CommentSeedData("sarah_jenkins", "Spot on! The cost of fixing the wrong abstraction is ten times higher than refactoring duplicate code later.")
                    )
            ));
            list.add(new PostSeedData(
                    "High-Throughput WebSockets with Java Virtual Threads (Project Loom)",
                    "Before Java 21, handling 100,000 concurrent persistent WebSocket connections required complex non-blocking reactive code (Netty/WebFlux). With Virtual Threads, developers can return to intuitive synchronous blocking models where each connection gets its own lightweight virtual thread with negligible memory overhead.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Java", "WebSockets", "Concurrency", "Loom"),
                    38, 1, 14, 0, 270,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Building Real-Time Collaborative Editors: Operational Transformation vs. CRDTs",
                    "Conflict-free Replicated Data Types (CRDTs) like Yjs and Automerge have largely superseded central server Operational Transformation (OT) for modern collaborative applications. We compare state-based vs. operation-based CRDTs, tombstone garbage collection, and P2P synchronization topology.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("CRDT", "RealTime", "Algorithms"),
                    29, 0, 11, 0, 210,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Docker Multi-Stage Builds: Reducing Container Image Footprints by 80%",
                    "Shipping compiler toolchains, package manager caches, and test artifacts into production container images creates security vulnerabilities and bloats deployment time. Using multi-stage Dockerfiles separates the compile stage from the runtime minimal base image (Distroless or Alpine), shrinking images from 1.2GB down to 65MB.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Docker", "DevOps", "Containers"),
                    35, 1, 15, 0, 245,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Rate Limiting at the Edge: Token Bucket Algorithm Implementation in Redis",
                    "Protecting public API endpoints from DDoS and abusive scraping requires low-latency rate limiting. By implementing the token bucket algorithm with atomic Redis Lua scripts, rate limiting decisions execute in sub-millisecond time while supporting burst allowances and sliding window evaluations.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Redis", "Security", "RateLimiting"),
                    44, 0, 17, 1, 305,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Observability Masterclass: OpenTelemetry Tracing, Prometheus Metrics, and Grafana",
                    "Logs tell you what happened; distributed traces tell you where the bottleneck occurred. We review end-to-end W3C trace context propagation across polyglot microservices, custom RED (Rate, Errors, Duration) metrics collection, and alerting configurations in production dashboards.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                    "Programming",
                    List.of("Observability", "OpenTelemetry", "DevOps"),
                    31, 0, 12, 0, 215,
                    List.of()
            ));
        } else if (communityName.contains("PixelRealm")) {
            list.add(new PostSeedData(
                    "Unreal Engine 5 Nanite and Lumen: How Geometry Virtualization Changed Rendering",
                    "Nanite eliminates traditional polygon budgets by virtualizing mesh geometry on the fly, streaming clusters based on pixel coverage. Combined with Lumen's real-time software and hardware ray-traced global illumination, indie and AAA developers can now import cinematic film assets directly into interactive game levels without manual LOD baking.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("UnrealEngine", "GameDev", "Graphics"),
                    49, 1, 19, 1, 330,
                    List.of(
                            new CommentSeedData("amudavikki", "Lumen in UE 5.4 feels so much crisper than early 5.0 builds. The reduction in ghosting on fast moving objects is noticeable.")
                    )
            ));
            list.add(new PostSeedData(
                    "The Rise of Tactical Shooters: Why High Tick Rate Servers Matter in Esports",
                    "In competitive tactical FPS games, every millisecond counts. A 128Hz server samples player inputs twice as frequently as a standard 64Hz server, reducing hit registration discrepancy and peekers advantage. We break down the server CPU cost implications and networking math behind modern competitive esports titles.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("Esports", "Multiplayer", "Networking"),
                    42, 2, 16, 1, 290,
                    List.of(
                            new CommentSeedData("liam_vance", "The difference in spray control between 64 and 128 tick is night and day.")
                    )
            ));
            list.add(new PostSeedData(
                    "Indie Spotlight: How Solo Developers Are Crafting Atmospheric Metroidvanias",
                    "From Hollow Knight to Animal Well, single-creator and small indie teams are pushing narrative art and tight platforming mechanics forward. What makes these games resonate is deliberate environmental storytelling, interconnected world design, and rewarding exploratory friction rather than excessive hand-holding markers.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("IndieDev", "GameDesign", "PixelArt"),
                    36, 0, 14, 0, 260,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "OLED vs. Fast IPS for Competitive Gaming: Motion Clarity and Latency Tested",
                    "QD-OLED and WOLED panels have essentially instantaneous pixel response times (< 0.03ms GTG), effectively eliminating motion blur without aggressive overdrive overshoot. But does the text clarity fringe and burn-in anxiety make them suitable as daily driver monitors? Here are our long-term testing findings.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1527690789675-4ea7d8da4eb3?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("Hardware", "Monitors", "Gaming"),
                    29, 1, 10, 1, 210,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "From Speedrunning to Game Preservation: The Technical Miracle of Emulation",
                    "Emulating proprietary console hardware on modern computers requires reverse engineering custom microcode, coprocessors, and cycle-accurate audio timing. Emulation teams not only keep classic video game history alive for future generations, but provide the precise input logging essential for tool-assisted speedruns.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("Speedrun", "Emulation", "RetroGaming"),
                    31, 0, 12, 0, 225,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Game Economy Design: Balancing In-Game Currencies and Player Retention",
                    "In live-service and RPG games, balancing reward cadence without triggering runaway inflation requires deep mathematical modeling. We explore sink and source mechanics, battle pass progression curves, and how ethical monetization protects long-term player trust.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("GameEconomy", "Design", "Product"),
                    25, 2, 8, 1, 180,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Ray Tracing vs. Path Tracing in Modern PC Titles: Silicon Performance Realities",
                    "While hybrid ray tracing uses rasterization for primary visibility and rays only for reflections and ambient occlusion, full path tracing calculates every ray bounce physically. We benchmark frame rates with neural reconstruction (DLSS / FSR) on top-tier graphics cards.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("RayTracing", "PCGaming", "GPU"),
                    44, 1, 18, 0, 315,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Procedural Level Generation: Algorithms Behind Infinite Replayability",
                    "Wave Function Collapse (WFC), cellular automata, and Perlin noise grids allow level designers to generate complex, believable labyrinths, dungeon topologies, and star systems that obey strict gameplay constraints. Discover how procedural tools augment human creative vision.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1612287233207-6a988d87532d?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("Algorithms", "Procedural", "GameDev"),
                    28, 0, 11, 0, 205,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Steam Deck and Handheld PC Ecosystem: Performance Tweaks and Battery Profiles",
                    "The portable gaming revolution is in full swing. By customizing TDP limits, pinning GPU clock speeds, and using lightweight Proton community layers, gamers can achieve 4+ hours of battery life on high-fidelity titles. Here are our top recommended launch parameters and configurations.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("SteamDeck", "Handheld", "LinuxGaming"),
                    33, 1, 13, 0, 240,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Audio Design in Horror Games: Using Binaural Spatial Audio for Maximum Tension",
                    "Nothing induces dread faster than an unseen footstep shifting from left to right behind your head. Sound designers use Head-Related Transfer Functions (HRTFs) and dynamic occlusion modeling to immerse players in chilling auditory soundscapes where silence is just as terrifying as sound.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("AudioDesign", "Soundtracks", "Gaming"),
                    27, 0, 10, 0, 195,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Fighting Game Netcode: Rollback vs. Delay-Based Networking Deep Dive",
                    "Traditional delay-based netcode pauses the game screen whenever internet packet transmission lags. Rollback netcode predicts player inputs locally and retroactively reconciles discrepancies without pausing frames, transforming online competitive tournaments across the globe.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                    "Gaming",
                    List.of("Netcode", "Rollback", "FGC"),
                    39, 0, 15, 0, 280,
                    List.of(
                            new CommentSeedData("liam_vance", "Rollback was the single best thing that ever happened to the fighting game community.")
                    )
            ));
        } else if (communityName.contains("CineVerse")) {
            list.add(new PostSeedData(
                    "The Mastery of the Long Take: Visual Geography and Cinematic Tension",
                    "From Hitchcock's 'Rope' to Alfonso Cuarón's 'Children of Men', the extended tracking shot creates an unrelenting psychological contract with the viewer. When there are no cuts, viewers cannot escape the scene, heightening empathy and spatial immersion. Let's analyze how camera blocking and choreography achieve this feat.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("Cinematography", "Directing", "FilmStudy"),
                    44, 0, 17, 0, 310,
                    List.of(
                            new CommentSeedData("amudavikki", "The car ambush sequence in Children of Men remains one of the greatest technical achievements in cinematic history.")
                    )
            ));
            list.add(new PostSeedData(
                    "Screenwriting Fundamentals: The Three-Act Structure vs. Dan Harmon's Story Circle",
                    "Classic Syd Field Three-Act structure provides a rock-solid foundation, but Dan Harmon's 8-step Story Circle offers a more character-driven lens focused on psychological descent and return with change. Which narrative framework do you rely on when mapping out screenplay beats?",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("Screenwriting", "Storytelling", "WritersRoom"),
                    36, 1, 13, 0, 255,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Color Theory in Cinema: Psychological Framing through Palettes in Blade Runner 2049",
                    "Roger Deakins' masterclass in color harmony pairs suffocating amber yellow in desolate ruins with clinical cold cyan in corporate headquarters and deep magenta in holographic intimacy. We dissect how every frame's chromatic choice reinforces K's existential yearning.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("ColorGrading", "Cinematography", "VisualArt"),
                    53, 0, 23, 1, 395,
                    List.of(
                            new CommentSeedData("chloe_dubois", "The yellow dust storm sequence in Las Vegas was inspired by actual Sydney dust storm photography from 2009. Incredible work.")
                    )
            ));
            list.add(new PostSeedData(
                    "Practical Effects vs. CGI: Why Nolan and Miller Champion Physical Stunts",
                    "In an era where every backdrop can be rendered virtually, Christopher Nolan and George Miller continue to detonate real planes and crash real trucks. Audiences possess an instinctive ability to perceive physical weight, natural light interaction, and inertia that synthetic pixels struggle to match.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("VFX", "PracticalEffects", "ActionCinema"),
                    39, 2, 15, 1, 280,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "The Golden Age of Neo-Noir: Cynicism, Shadows, and Urban Desolation",
                    "Neo-noir updated the German expressionist shadows of the 1940s into fluorescent-lit convenience stores and rain-slicked pavement. We explore Chinatown, Taxi Driver, and Heat, analyzing how protagonists trapped in morally ambiguous cityscapes mirror modern societal anxieties.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("FilmNoir", "CinemaHistory", "Classics"),
                    30, 0, 11, 0, 220,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Sound Mixing and Foley Art: The Unsung Heroes of Emotional Immersion",
                    "A door closing in a film is rarely just a door; it's a celery stalk snapped in half, an iron latch dropped onto wet gravel, and a subtle bass drop. Foley artists construct tactile worlds from scratch. Here is a look behind the curtain at how Hollywood sound stages create auditory magic.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("SoundDesign", "Foley", "AudioProduction"),
                    26, 0, 9, 0, 190,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "International Cinema Spotlight: Korean Thrillers and Narrative Unpredictability",
                    "From Park Chan-wook's 'Oldboy' and 'Decision to Leave' to Bong Joon-ho's 'Memories of Murder', South Korean cinema has mastered genre-bending tonal shifts where tragedy and dark humor coexist within the same beat. What makes Korean pacing so uniquely visceral?",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("KoreanCinema", "Thrillers", "WorldCinema"),
                    41, 1, 16, 0, 295,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Aspect Ratio as Narrative Device: The Power of 4:3 in Modern Psychological Drama",
                    "Films like 'The Lighthouse', 'First Reformed', and 'Ida' chose boxed academy ratio (1.33:1 or 1.37:1) over sweeping anamorphic widescreen. Confining actors within narrow vertical frames evokes claustrophobia and spiritual entrapment. Let's discuss when unconventional ratios serve the story best.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("AspectRatio", "Directing", "Framing"),
                    33, 0, 12, 0, 240,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Film Editing: The Kuleshov Effect and the Rhythm of Cinematic Pacing",
                    "By intercutting a blank actor's facial expression with a bowl of soup, a child in a coffin, or an attractive woman, Lev Kuleshov proved that viewers project their own emotional meaning across editorial cuts. We examine how montage editing dictates emotional tempo.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("Editing", "FilmTheory", "Pacing"),
                    28, 1, 10, 0, 200,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "The Evolution of Science Fiction Cinema: From 2001 to Arrival",
                    "Great science fiction does not predict gadgets; it interrogates human consciousness. Comparing Kubrick's meditative cosmic dread in '2001: A Space Odyssey' with Denis Villeneuve's linguistic exploration in 'Arrival' shows how speculative cinema tackles our relationship with time and destiny.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("SciFi", "Classics", "Philosophy"),
                    35, 0, 14, 0, 250,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Documentary Filmmaking: Ethics, Objectivity, and Eliciting Authentic Truths",
                    "Documentary directors inevitably reshape reality through the camera lens and editing suite. How do creators balance journalistic truth with cinematic entertainment? We examine observational Cinema Verite and the participatory modes of modern investigative documentary.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80",
                    "Entertainment",
                    List.of("Documentary", "Journalism", "Storytelling"),
                    32, 1, 11, 0, 230,
                    List.of()
            ));
        } else if (communityName.contains("ShutterCraft")) {
            list.add(new PostSeedData(
                    "Mastering the Exposure Triangle: Balancing Shutter Speed, Aperture, and ISO",
                    "Every photograph is an exercise in compromise between depth of field (aperture), motion freeze or blur (shutter speed), and sensor gain noise (ISO). Understanding how to manipulate these three variables manually unlocks creative freedom over your camera and removes reliance on auto modes.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Photography101", "Exposure", "CameraSettings"),
                    47, 0, 18, 0, 325,
                    List.of(
                            new CommentSeedData("amudavikki", "Shooting manual transformed my photography. Once you understand the trade-offs, you compose with intention.")
                    )
            ));
            list.add(new PostSeedData(
                    "Street Photography Ethics and Techniques: Candid Moments in Busy Cities",
                    "Street photography is about capturing fleeting, unrepeatable slices of human life. We discuss zone focusing with wide-angle 28mm and 35mm primes, how to blend into crowds respectfully, and navigating public privacy laws with empathy and integrity.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("StreetPhotography", "Urban", "Candid"),
                    52, 1, 21, 1, 375,
                    List.of(
                            new CommentSeedData("chloe_dubois", "Zone focusing at f/8 with a 28mm lens is the fastest way to nail street focus without missing the moment.")
                    )
            ));
            list.add(new PostSeedData(
                    "Prime vs. Zoom Lenses: Why a 50mm f/1.8 Will Transform Your Composition",
                    "The ubiquitous 'nifty fifty' prime lens forces photographers to zoom with their feet, developing spatial awareness and intimate perspective. The fast f/1.8 aperture produces creamy subject isolation (bokeh) and excels in low-light environments without breaking the bank.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Lenses", "Gear", "Bokeh"),
                    38, 0, 15, 0, 270,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Golden Hour vs. Blue Hour: Capturing Drama in Natural Landscape Lighting",
                    "Low sun angles during golden hour infuse mountain ranges and coastal shorelines with warm directional light and long shadows. Thirty minutes later, blue hour bathes the atmosphere in surreal indigo and violet hues. Here is our field guide to timing and white balance bracket exposures.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Landscape", "GoldenHour", "Lighting"),
                    45, 0, 19, 0, 310,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Color Grading in Lightroom: Crafting a Cohesive Visual Style and Mood",
                    "Moving beyond standard saturation and contrast sliders, learning to shape tone curves and split-tone shadows and highlights gives photographs a distinctive signature look. We explore how to manage HSL channels and preserve authentic skin tones.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Lightroom", "Editing", "ColorGrading"),
                    34, 1, 12, 1, 240,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Long Exposure Photography: Silky Waterfalls, Light Trails, and ND Filters",
                    "By slipping a 10-stop Neutral Density (ND) filter in front of your glass, you can extend daylight exposures to 30 seconds or several minutes, transforming churning sea foam into mirror-like glass and traffic into streaks of pure luminous energy. Essential tripod stability tips inside.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("LongExposure", "Filters", "NightPhotography"),
                    31, 0, 12, 0, 220,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Astrophotography Guide: Settings for Capturing the Milky Way Core",
                    "Photographing our galaxy requires planning around moon phases, light pollution maps, and shutter speed calculations (the 500 Rule or NPF rule) to avoid star trails. Learn how to shoot stacked exposures with fast wide lenses for breathtaking night sky vistas.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Astrophotography", "MilkyWay", "NightSky"),
                    49, 1, 20, 0, 350,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Portrait Lighting Fundamentals: One-Light Setups for Striking Studio Portraits",
                    "You do not need a studio full of strobes to capture magazine-quality portraits. A single key light inside a 36-inch softbox positioned 45 degrees up and to the side creates flattering Rembrandt lighting with classic triangular cheek catchlights. Diagram and setup photos included.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Portraits", "StudioLighting", "Softbox"),
                    37, 0, 14, 0, 260,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "The Rebirth of Film Photography: 35mm and Medium Format Film Stock Comparison",
                    "Analog photography is experiencing an unprecedented renaissance. Photographers love Kodak Portra 400 for dreamy pastel skin tones and Ilford HP5 Plus for gritty monochrome contrast. Why physical film grain continues to outshine digital perfection.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("FilmPhotography", "Analog", "35mm"),
                    29, 0, 11, 0, 215,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Rule of Thirds and Beyond: Using Leading Lines and Negative Space for Depth",
                    "Composition guidelines are tools, not handcuffs. Placing subjects along grid intersections creates natural balance, while bold diagonal leading lines draw the viewer's eye through the frame. Learn when breaking compositional symmetry creates magnetic impact.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Composition", "VisualArts", "Framing"),
                    42, 1, 16, 0, 295,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Macro Photography Secrets: Exploring Tiny Worlds with Extension Tubes",
                    "Macro photography opens up an invisible universe right on your windowsill—from water droplets on spiderwebs to crystalline eye facets on insects. How extension tubes provide 1:1 magnification on standard prime lenses without costly dedicated macro optics.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                    "Photography",
                    List.of("Macro", "NaturePhotography", "CloseUp"),
                    36, 0, 13, 0, 250,
                    List.of()
            ));
        } else if (communityName.contains("VentureForge")) {
            list.add(new PostSeedData(
                    "Finding True Product-Market Fit: The 40% Sean Ellis Survey Framework",
                    "How do you know when you have product-market fit before your runway runs dry? The Sean Ellis test asks active users: 'How would you feel if you could no longer use this product?' If at least 40% answer 'very disappointed', you have found traction and are ready to invest in growth.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Startups", "ProductMarketFit", "Growth"),
                    48, 0, 19, 0, 340,
                    List.of(
                            new CommentSeedData("amudavikki", "This metric saved us from burning money on paid ads before our core retention loop was validated.")
                    )
            ));
            list.add(new PostSeedData(
                    "Bootstrapping to $1M ARR: Lessons Learned Without Outside Venture Capital",
                    "Taking venture capital forces hyper-growth that kills 90% of early ventures. Bootstrapping teaches pricing discipline, relentless customer empathy, and positive unit economics from day one. Here are the 5 operational tenets that allowed us to build profitably without dilution.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Bootstrapping", "SaaS", "IndieHacker"),
                    58, 1, 24, 1, 410,
                    List.of(
                            new CommentSeedData("sarah_jenkins", "Maintaining 100% equity ownership and building on your own timeline is the ultimate founder freedom.")
                    )
            ));
            list.add(new PostSeedData(
                    "Customer Discovery Interviews: The 'Mom Test' Principles for Real Feedback",
                    "Never ask potential customers if they think your idea is good—they will lie to be polite. The Mom Test framework reveals how to ask about past behavior, current budget expenditures, and painful workarounds rather than speculative future intent.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("CustomerDiscovery", "UserResearch", "Validation"),
                    39, 1, 15, 0, 275,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "SaaS Unit Economics: LTV to CAC Ratios, Churn Calculations, and Payback Periods",
                    "If your Customer Acquisition Cost (CAC) payback period exceeds 14 months for SMB customers, your cash flow will strangle growth. We provide a downloadable spreadsheet detailing net revenue retention (NRR), blended CAC, and gross margin optimization.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Metrics", "UnitEconomics", "Finance"),
                    43, 0, 17, 0, 305,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Pitch Deck Anatomy: The 10 Slides Every Seed-Stage Investor Wants to See",
                    "Investors spend an average of 2 minutes and 40 seconds reviewing a seed-stage pitch deck. Cut the buzzwords: problem, solution, market size (TAM/SAM), unique insight, early traction, business model, competition matrix, and team pedigree.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("VentureCapital", "PitchDeck", "Fundraising"),
                    35, 1, 13, 0, 250,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Building in Public: How Transparency Built Our Initial Waitlist of 10,000 Users",
                    "Sharing revenue milestones, server outages, feature prototypes, and architectural pivots on public social feeds humanizes your startup. People don't root for faceless corporations; they champion vulnerable founders building in the open.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("BuildInPublic", "Marketing", "Community"),
                    46, 0, 18, 0, 330,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Product-Led Growth (PLG): Designing Viral Loops and Frictionless Onboarding",
                    "If your product requires an enterprise sales demo call before a user can test value, you are vulnerable to faster self-serve competitors. How to design 'Aha moments' within 60 seconds of signup and build collaborative share loops directly into core product workflows.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("PLG", "Onboarding", "ProductStrategy"),
                    32, 1, 12, 0, 225,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Hiring Your First 5 Engineers: Culture Add over Culture Fit",
                    "Early-stage engineering hires must be generalists with high agency who enjoy ambiguity and customer communication. Why hiring specialists too early slows product velocity, and how to assess problem solving through realistic paid trial projects.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Hiring", "EngineeringLeadership", "TeamBuilding"),
                    37, 0, 15, 0, 265,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "The Death of Free Tiers: Why Reverse Trials Convert 3x Better for B2B SaaS",
                    "Perpetual free tiers attract resource-draining free-riders while giving prospective buyers zero urgency to upgrade. Reverse trials start users on the full Pro tier for 14 days, then gracefully downgrade them to basic functionality, driving 300% higher paid conversion rates.",
                    "sarah_jenkins",
                    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Pricing", "Conversion", "SaaS"),
                    41, 1, 16, 1, 290,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Navigating Founder Burnout: Sustainable Pacing in the Early Stage Grind",
                    "The romanticization of 90-hour workweeks is destroying founder health and leading to erratic strategic decision-making. Sleep deprivation impairs cognitive risk assessment. Practical boundary-setting systems for keeping your mental clarity sharp over the marathon.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("MentalHealth", "Founders", "Wellness"),
                    33, 0, 13, 0, 240,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "SAFE Notes vs. Priced Equity Rounds: What First-Time Founders Need to Know",
                    "Y Combinator's Simple Agreement for Future Equity (SAFE) streamlines early financing, but stacking uncapped SAFEs with varying valuation caps can lead to catastrophic dilution surprises when a Series A priced round closes. Cap table simulations inside.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
                    "Startups",
                    List.of("Legal", "AngelInvesting", "CapTable"),
                    38, 0, 15, 0, 275,
                    List.of()
            ));
        } else if (communityName.contains("TechPulse")) {
            list.add(new PostSeedData(
                    "Next-Generation Silicon: 2nm Gate-All-Around (GAA) Architecture Explained",
                    "As FinFET transistors reach their physical quantum tunneling limits, major semiconductor foundries are transitioning to Gate-All-Around nanosheet architectures. Encapsulating the channel on all four sides delivers superior electrostatic control, slashing power leakage by 30% at sub-2nm nodes.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("Silicon", "Semiconductors", "Hardware"),
                    45, 0, 18, 0, 320,
                    List.of(
                            new CommentSeedData("amudavikki", "The thermal density improvements with GAA are going to be massive for fanless ultraportables.")
                    )
            ));
            list.add(new PostSeedData(
                    "The State of Foldable Displays: Hinge Durability, Crease Reduction, and Longevity",
                    "Foldable smartphones have graduated from fragile experiments to rugged daily drivers. Through teardowns of teardrop hinge mechanisms and ultra-thin glass (UTG) substrates, we evaluate whether IPX8 water resistance and crease reduction have reached mainstream parity.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("Smartphones", "Foldables", "HardwareReview"),
                    51, 1, 20, 1, 365,
                    List.of(
                            new CommentSeedData("arjun_patel", "The zero-gap teardrop hinges finally solved the dust ingress issue that plagued first-gen foldables.")
                    )
            ));
            list.add(new PostSeedData(
                    "Solid-State Batteries: Why Energy Density Breakthroughs Will Transform EVs",
                    "Replacing volatile liquid electrolyte slurries with solid ceramic or polymer conductors eliminates fire hazards while nearly doubling volumetric energy density. We examine pouch cell degradation benchmarks and the remaining manufacturing hurdles facing mass production.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("Energy", "ElectricVehicles", "Batteries"),
                    39, 1, 16, 0, 280,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Smart Home Matter Protocol in 2026: Interoperability Wins and Lingering Frustrations",
                    "The Matter standard promised seamless communication across Apple Home, Google Home, and Home Assistant using Thread mesh networks. We evaluate real-world device commissioning speeds, border router failover, and whether multi-admin control finally delivers on the smart home promise.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("SmartHome", "Matter", "IoT"),
                    34, 2, 13, 1, 245,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Spatial Computing and XR Headsets: Micro-OLED Displays and Foveated Rendering",
                    "Eye tracking paired with foveated rendering renders ultra-sharp detail only at the center of the user's retina, cutting GPU pixel fill rates by up to 75%. Exploring the optical physics of pancake lenses and spatial audio pass-through latency in next-gen mixed reality.",
                    "liam_vance",
                    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("SpatialComputing", "VR", "AR", "Vision"),
                    42, 1, 17, 0, 305,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Quantum Computing Milestones: Logical Qubits and Fault-Tolerant Architectures",
                    "Neutral-atom and superconducting quantum processors are transitioning from noisy physical qubits (NISQ) to error-corrected logical qubits using surface codes. What quantum supremacy milestones mean for post-quantum cryptography (PQC) and RSA deprecation.",
                    "elena_rostova",
                    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("Quantum", "FutureTech", "Physics"),
                    31, 0, 12, 0, 225,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Mechanical Keyboards: Custom Switches, Gasket Mounts, and Acoustic Mods",
                    "From Hall Effect magnetic rapid-trigger switches to custom polycarbonate plates and tape-modded PCBs, custom mechanical keyboards have become an art form. How acoustic resonance tuning elevates everyday programming ergonomics.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("Keyboards", "DeskSetup", "Hardware"),
                    47, 0, 19, 0, 335,
                    List.of(
                            new CommentSeedData("marcus_chen", "Once you try an aluminum gasket-mounted board with linear lubed switches, you can never go back to mushy rubber domes.")
                    )
            ));
            list.add(new PostSeedData(
                    "Neural Interface Devices: Non-Invasive EMG Sensors for Hand Gesture Control",
                    "Wearable wristbands tracking surface electromyography (sEMG) detect microscopic motor unit electrical impulses before your fingers even move. Exploring how non-invasive neural interfaces are poised to replace mouse pointers and touchscreen taps.",
                    "arjun_patel",
                    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("NeuroTech", "Wearables", "HCI"),
                    28, 1, 11, 0, 205,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Miniaturized Camera Sensors: 1-Inch Smartphone Sensors vs. Dedicated Compacts",
                    "With Sony's LYT-900 1-inch type sensor packed into mobile chassis, computational photography and raw physical light gathering have converged. Comparing dynamic range, chromatic aberration, and depth of field against legendary dedicated compact cameras like the Ricoh GR and Fujifilm X100.",
                    "chloe_dubois",
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("MobilePhotography", "Sensors", "Cameras"),
                    36, 0, 14, 0, 260,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "GaN Charging Revolution: How Gallium Nitride Shrunk 140W Laptop Chargers",
                    "Gallium Nitride semiconductors handle higher voltages and switch frequencies ten times faster than legacy silicon, wasting less energy as heat. How GaN III circuitry enabled pocketable 140W USB-C PD 3.1 power bricks capable of fast-charging multiple high-drain laptops simultaneously.",
                    "marcus_chen",
                    "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("GaN", "Chargers", "Electronics"),
                    33, 0, 13, 0, 240,
                    List.of()
            ));
            list.add(new PostSeedData(
                    "Open-Source Hardware and RISC-V: Challenging ARM and x86 Monopolies",
                    "The open, royalty-free RISC-V ISA is accelerating innovation in microcontrollers, automotive electronics, and server hardware accelerators. We explore vector extension extensions, custom instruction sets, and the geopolitical momentum behind open silicon.",
                    "amudavikki",
                    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
                    "Technology",
                    List.of("RISCV", "OpenSource", "Processors"),
                    40, 1, 16, 0, 290,
                    List.of()
            ));
        }

        return list;
    }

    private static class DemoUserDefinition {
        final String username;
        final String email;

        DemoUserDefinition(String username, String email) {
            this.username = username;
            this.email = email;
        }
    }

    private static class GroupDefinition {
        final String name;
        final String description;
        final String avatarUrl;
        final String category;

        GroupDefinition(String name, String description, String avatarUrl, String category) {
            this.name = name;
            this.description = description;
            this.avatarUrl = avatarUrl;
            this.category = category;
        }
    }

    private static class PostSeedData {
        final String title;
        final String content;
        final String authorKey;
        final String mediaUrl;
        final String category;
        final List<String> tags;
        final int likeCount;
        final int dislikeCount;
        final int verifiedCount;
        final int notVerifiedCount;
        final int viewCount;
        final List<CommentSeedData> comments;

        PostSeedData(String title, String content, String authorKey, String mediaUrl, String category,
                     List<String> tags, int likeCount, int dislikeCount, int verifiedCount,
                     int notVerifiedCount, int viewCount, List<CommentSeedData> comments) {
            this.title = title;
            this.content = content;
            this.authorKey = authorKey;
            this.mediaUrl = mediaUrl;
            this.category = category;
            this.tags = tags;
            this.likeCount = likeCount;
            this.dislikeCount = dislikeCount;
            this.verifiedCount = verifiedCount;
            this.notVerifiedCount = notVerifiedCount;
            this.viewCount = viewCount;
            this.comments = comments;
        }
    }

    private static class CommentSeedData {
        final String authorKey;
        final String content;

        CommentSeedData(String authorKey, String content) {
            this.authorKey = authorKey;
            this.content = content;
        }
    }
}
