var punchSpeed : float = 1;
var punchHitTime : float = 0.2;
var punchTime : float = 0.4;
var punchPosition = new Vector3 (0, 0, 0.8);
var punchRadius : float = 1.3;
var punchHitPoints : int = 1;

var punchSound : AudioClip;
var shootSound : AudioClip;

var projectile : Rigidbody;
var projectileSpeed : float = 8.0;

private var busy = false;

private var controller : SideScrollController;

function Start ()
{
	animation["punch"].speed = punchSpeed;
	controller = GetComponent(SideScrollController);
}

function Update ()
{	 
	if(!busy && controller.IsControllable() && Input.GetButtonDown ("Fire1"))
	{	
		SendMessage ("DidPunch");
		busy = true;
	}
	
	if (!busy && controller.IsControllable() && Input.GetButtonDown("Fire2"))
	{
		SendMessage("DidShoot");
		busy = true;
	}
}

function DidPunch ()
{
	animation.CrossFadeQueued("punch", 0.1, QueueMode.PlayNow);
	yield WaitForSeconds(punchHitTime);
	var pos = transform.TransformPoint(punchPosition);
	var enemies : GameObject[] = GameObject.FindGameObjectsWithTag("Enemy");
	
	if (punchSound)
		AudioSource.PlayClipAtPoint(punchSound, transform.position);
	
	for (var go : GameObject in enemies)
	{
		var enemy = go.GetComponent(EnemyDamage);
		if (enemy == null)
			continue;
			
		if (Vector3.Distance(enemy.transform.position, pos) < punchRadius)
			enemy.SendMessage("ApplyDamage", punchHitPoints);
	}
	yield WaitForSeconds(punchTime - punchHitTime);
	busy = false;
}

function DidShoot () {
	animation.CrossFadeQueued("shoot", 0.1, QueueMode.PlayNow);
	yield WaitForSeconds(0.16);
	var projectileClone : Rigidbody = Instantiate(projectile, transform.position + new Vector3(0,1,0) + transform.forward, transform.rotation);
	projectileClone.velocity = transform.forward * projectileSpeed;
	if (shootSound)
		AudioSource.PlayClipAtPoint(shootSound, transform.position, 2.0);
	busy = false;
}

function OnDrawGizmosSelected ()
{
	Gizmos.color = Color.yellow;
	Gizmos.DrawWireSphere (transform.TransformPoint(punchPosition), punchRadius);
}

@script RequireComponent(AudioSource)